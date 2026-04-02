/**
 * graphTraversal.js
 * EXECUTION ENGINE — now fully stateless and thread-safe.
 */

const { ResolverAdapter } = require("./resolverNew");
const { isRelevantCall } = require("./filters");

// ─── Shared graph factory ─────────────────────────────────────────────────────

function createGraph() {
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();  // nodeKey → node id
    const flowSet = new Set();  // dedup keys for flow steps
    const flow = [];

    function upsertNode(key, label, file, startLine, endLine, type) {
        if (nodeMap.has(key)) return nodeMap.get(key);
        const id = `node_${nodes.length}`;
        nodeMap.set(key, id);
        nodes.push({ id, label, file, startLine, endLine, type });
        return id;
    }

    function addEdge(fromId, toId) {
        if (!fromId || !toId || fromId === toId) return;
        // Optimization: check if edge exists using a simple string key
        if (!edges.some(e => e.from === fromId && e.to === toId)) {
            edges.push({ from: fromId, to: toId });
        }
    }

    function pushFlow(entry) {
        const key = `${entry.type}:${entry.label}:${entry.file}:${entry.startLine}`;
        if (flowSet.has(key)) return;
        flowSet.add(key);
        flow.push({ ...entry, step: flow.length + 1 });
    }

    return { nodes, edges, flow, upsertNode, addEdge, pushFlow };
}

function classifyFile(file) {
    if (!file) return "backend";
    const f = file.toLowerCase();
    if (f.endsWith(".jsx") || f.endsWith(".tsx")) return "frontend";
    if (f.includes("frontend") || f.includes("client") || f.includes("ui")) return "frontend";
    if (f.includes("pages") || f.includes("components") || f.includes("views")) return "frontend";
    return "backend";
}

function isInsideFunction(line, file, fnInfo) {
    if (!line || !fnInfo.startLine || !fnInfo.endLine) return false;
    return file === fnInfo.file && line >= fnInfo.startLine && line <= fnInfo.endLine;
}

// ─── Forward DFS ──────────────────────────────────────────────────────────────

// ✅ ADDED 'index' as the first parameter
function traceForward(index, entryFnInfo, maxDepth = 8) {
    const { nodes, edges, flow, upsertNode, addEdge, pushFlow } = createGraph();
    const resolver = new ResolverAdapter(index); // Create local resolver
    const fullyProcessed = new Set(); 

    function dfs(fnInfo, callerNodeId = null, callStack = new Set(), depth = 0) {
        if (depth > maxDepth) return;
        if (callStack.has(fnInfo.id)) return; // Strict Cycle Guard

        const nodeType = classifyFile(fnInfo.file);
        const nodeId = upsertNode(fnInfo.id, fnInfo.name, fnInfo.file, fnInfo.startLine, fnInfo.endLine, nodeType);
        
        if (callerNodeId) addEdge(callerNodeId, nodeId);

        pushFlow({
            label: fnInfo.name,
            file: fnInfo.file,
            startLine: fnInfo.startLine,
            endLine: fnInfo.endLine,
            type: "function",
            layer: nodeType,
        });

        if (fullyProcessed.has(fnInfo.id)) return;
        callStack.add(fnInfo.id);

        // 1. API calls (using passed index)
        const apiCalls = index.apiCalls.filter(api => isInsideFunction(api.line, api.file, fnInfo));
        
        for (const api of apiCalls) {
            const apiLabel = `[${api.method}] ${api.url ?? "unknown"}`;
            const apiId = upsertNode(`api:${apiLabel}:${api.line}`, apiLabel, fnInfo.file, api.line, null, "api");
            addEdge(nodeId, apiId);
            pushFlow({ label: apiLabel, file: fnInfo.file, startLine: api.line, endLine: null, type: "api" });

            // Trace Bridge to Backend
            const route = resolver.findRoute(api.url, api.method);
            if (route && route.handlerFunc) {
                dfs(route.handlerFunc, apiId, new Set(callStack), depth + 1);
            }
        }

        // 2. Outbound Function Calls
        // If your parserv2 index stores global calls, filter them specifically for this function
        const functionCalls = (index.callsTo.get(fnInfo.file) || []).filter(c => 
            isInsideFunction(c.line, c.file, fnInfo)
        );

        for (const call of functionCalls) {
            // Check relevance using the local resolver
            if (!isRelevantCall(call.name, call.object || null, (name) => resolver.findFunction(name))) continue;

            const resolved = resolver.findFunction(call.name, fnInfo.file);
            if (resolved) {
                dfs(resolved, nodeId, new Set(callStack), depth + 1);
            } else {
                const label = call.object ? `${call.object}.${call.name}()` : `${call.name}()`;
                const extId = upsertNode(`ext:${label}:${call.line}`, label, fnInfo.file, call.line, null, "external");
                addEdge(nodeId, extId);
                pushFlow({ label, file: fnInfo.file, startLine: call.line, endLine: null, type: "external" });
            }
        }

        callStack.delete(fnInfo.id);
        fullyProcessed.add(fnInfo.id);
    }

    dfs(entryFnInfo);
    return { flow, nodes, edges };
}

// ─── Backward BFS ─────────────────────────────────────────────────────────────

// ✅ ADDED 'index' as the first parameter
function traceBackward(index, entryFnInfo, maxDepth = 4) {
    const { nodes, edges, flow, upsertNode, addEdge, pushFlow } = createGraph();
    const visited = new Set();
    const resolver = new ResolverAdapter(index);

    const targetId = upsertNode(
        entryFnInfo.id, entryFnInfo.name, entryFnInfo.file,
        entryFnInfo.startLine, entryFnInfo.endLine, classifyFile(entryFnInfo.file)
    );

    const queue = [{ fnInfo: entryFnInfo, nodeId: targetId, depth: 0 }];

    while (queue.length > 0) {
        const { fnInfo: current, nodeId: currentNodeId, depth } = queue.shift();

        if (visited.has(current.id)) continue;
        visited.add(current.id);
        if (depth >= maxDepth) continue;

        // Use index.functionsById to find callers (who calls this function?)
        // Note: In a real AST index, you'd want a pre-computed "callerMap" for O(1)
        for (const [file, calls] of index.callsTo.entries()) {
            const callersInFile = calls.filter(c => c.name === current.name);
            
            for (const call of callersInFile) {
                // Find which function in this file wraps this line
                let callerFn = null;
                // Optimization: Only look at functions in the same file as the call
                for (const fn of index.functionsById.values()) {
                    if (fn.file === file && isInsideFunction(call.line, file, fn)) {
                        callerFn = fn;
                        break;
                    }
                }

                if (callerFn && !visited.has(callerFn.id)) {
                    const callerId = upsertNode(
                        callerFn.id, callerFn.name, callerFn.file,
                        callerFn.startLine, callerFn.endLine, classifyFile(callerFn.file)
                    );
                    addEdge(callerId, currentNodeId); 
                    queue.push({ fnInfo: callerFn, nodeId: callerId, depth: depth + 1 });
                }
            }
        }
    }

    return { flow, nodes, edges, targetNodeId: targetId };
}

module.exports = { traceForward, traceBackward };
