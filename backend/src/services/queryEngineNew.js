// Removed global 'index' require
const { ResolverAdapter } = require("./resolverNew");
const { traceForward, traceBackward } = require("./graphNew");
const { filterFlow } = require("./filters");
const { buildForwardStats, buildBackwardStats } = require("./statsBuilder");
const { attachCodeToNodes, extractCode } = require("./code_service");

function resolveEntry(input) {
    if (!input || typeof input !== "string") return { type: "function", name: String(input) };

    const trimmed = input.trim();

    const routeMatch = trimmed.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|ALL)\s+(\S+)$/i);
    if (routeMatch) return { type: "route", method: routeMatch[1].toUpperCase(), path: routeMatch[2] };

    const eventMatch = trimmed.match(/^(on[A-Z][a-zA-Z]*)(?::(.+))?$/);
    if (eventMatch) return { type: "event", event: eventMatch[1], element: eventMatch[2] ?? null };

    return { type: "function", name: trimmed };
}

// Pass index and resolver into this helper
function findEventHandler(index, resolver, eventName, element) {
    for (const ev of index.events.values()) {
        if (ev.event !== eventName) continue;
        if (element && ev.element !== element) continue;

        const fnInfo = resolver.findFunction(ev.handler, ev.file);
        if (fnInfo) return { fnInfo, eventMeta: ev };
    }
    return null;
}

// ✅ Add index as the first parameter
function analyzeFunction(index, input, direction = "forward", maxDepth = null) {
    // Instantiate local resolver
    const resolver = new ResolverAdapter(index);
    const entry = resolveEntry(input);

    if (entry.type === "route") {
        const route = resolver.findRoute(entry.path, entry.method);
        if (!route) return { error: `Route "${input}" not found.` };
        
        const fnInfo = route.handlerFunc; // Already resolved in findRoute
        if (!fnInfo) return { error: `Handler for "${input}" not found.` };

        return _runForward(index, fnInfo, maxDepth ?? 8, { entryType: "route", route });
    }

    if (entry.type === "event") {
        const found = findEventHandler(index, resolver, entry.event, entry.element);
        if (!found) return { error: `Event "${input}" not found.` };

        return _runForward(index, found.fnInfo, maxDepth ?? 8, { 
            entryType: "event", 
            event: found.eventMeta 
        });
    }

    const fnInfo = resolver.findFunction(entry.name);
    if (!fnInfo) return { error: `Function "${input}" not found.` };

    return direction === "backward"
        ? _runBackward(index, fnInfo, maxDepth ?? 4)
        : _runForward(index, fnInfo, maxDepth ?? 8, { entryType: "function" });
}

function getFunctionDefinition(index, name) {
    const resolver = new ResolverAdapter(index);
    const fnInfo = resolver.findFunction(name);
    if (!fnInfo) return null;

    return {
        file:      fnInfo.file,
        startLine: fnInfo.startLine,
        endLine:   fnInfo.endLine,
        code:      extractCode(fnInfo.file, fnInfo.startLine, fnInfo.endLine) ?? null,
    };
}

// ✅ Pass index down to the trace functions
function _runForward(index, fnInfo, maxDepth, entryMeta = {}) {
    // NOTE: Make sure your `traceForward` in graphNew.js is updated to accept `index`
    const { flow: rawFlow, nodes: rawNodes, edges } = traceForward(index, fnInfo, maxDepth);

    const apiCallsFound = [];
    rawNodes.forEach(node => {
        const calls = index.apiCalls.filter(api => api.file === node.file);
        if (calls.length > 0) apiCallsFound.push(...calls);
    });

    const nodes = attachCodeToNodes(rawNodes);
    const flow = filterFlow(rawFlow);
    const stats = buildForwardStats(flow);

    return {
        flow,
        fullGraph: { nodes, edges },
        stats,
        meta: {
            entryId: fnInfo.id,
            entryName: fnInfo.name,
            maxDepth,
            direction: "forward",
            apiCalls: apiCallsFound,
            ...entryMeta,
        },
    };
}

function _runBackward(index, fnInfo, maxDepth) {
    // NOTE: Make sure your `traceBackward` in graphNew.js is updated to accept `index`
    const { flow, nodes: rawNodes, edges } = traceBackward(index, fnInfo, maxDepth);

    const nodes = attachCodeToNodes(rawNodes);
    const stats = buildBackwardStats(flow);

    return {
        target:    fnInfo.name,
        targetId:  fnInfo.id,
        flow,
        fullGraph: { nodes, edges },
        stats,
        meta: {
            entryId:   fnInfo.id,
            entryName: fnInfo.name,
            maxDepth,
            direction: "backward",
            entryType: "function",
        },
    };
}

module.exports = { analyzeFunction, getFunctionDefinition };
