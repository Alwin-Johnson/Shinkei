const dynamicStore = require('./dynamicStore');
const sseService = require('./sseService');
const { analyzeFunction } = require('./queryEngine');

// ─── 📡 STATE FOR REAL-TIME ROOT DETECTION ────────────────────────────
let waitingForRealtimeRoot = false;
let lastIgnoredTraceId = null;
let realtimeAnalysisOptions = { direction: 'forward', depth: 8 };

function enableRealtimeWaiting(options = {}) {
    waitingForRealtimeRoot = true;
    realtimeAnalysisOptions = {
        direction: options.direction || 'forward',
        depth: parseInt(options.depth) || 8
    };
    console.log(`📡 Real-time mode: Waiting for next interaction (Direction: ${realtimeAnalysisOptions.direction}, Depth: ${realtimeAnalysisOptions.depth})...`);
}

function resetRealtimeState() {
    waitingForRealtimeRoot = false;
    lastIgnoredTraceId = null;
    console.log("🧹 [Telemetry] Real-time state reset.");
}

// ─── 📥 PAYLOAD PARSING & LOGIC ───────────────────────────────────────
function processResourceSpans(resourceSpans) {
    const validSpansForPulse = [];
    let rootCandidate = null;

    // 1. Flatten and Process Spans
    resourceSpans.forEach(resource => {
        resource.scopeSpans.forEach(scope => {
            scope.spans.forEach(span => {
                const flatSpan = _flattenSpan(span);
                dynamicStore.addSpan(flatSpan);

                rootCandidate = _detectRootCandidate(flatSpan, rootCandidate);
                _extractPulseData(flatSpan, validSpansForPulse);
            });
        });
    });

    // 2. Trigger Graph Analysis if Root Found
    if (waitingForRealtimeRoot && rootCandidate) {
        _triggerRealtimeAnalysis(rootCandidate);
    }

    // 3. Broadcast Waterfall Pulse
    if (validSpansForPulse.length > 0) {
        _broadcastWaterfallData(validSpansForPulse);
    }
}

// ─── PRIVATE HELPERS ──────────────────────────────────────────────────

function _flattenSpan(span) {
    return {
        traceId: span.traceId,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId,
        name: span.name,
        startTime: span.startTimeUnixNano,
        endTime: span.endTimeUnixNano,
        attributes: span.attributes.reduce((acc, attr) => {
            acc[attr.key] = attr.value.stringValue ?? attr.value.intValue ?? attr.value.boolValue;
            return acc;
        }, {})
    };
}

function _detectRootCandidate(flatSpan, currentCandidate) {
    // If we aren't waiting, or already found one, do nothing
    if (!waitingForRealtimeRoot || currentCandidate) return currentCandidate;

    const file = flatSpan.attributes['shinkei.static.file'];
    const line = flatSpan.attributes['shinkei.static.line'];
    const staticFnName = flatSpan.attributes['shinkei.static.function'];
    const name = flatSpan.name || "";
    const method = flatSpan.attributes['http.method'] || flatSpan.attributes['http.url'];
    const route = flatSpan.attributes['http.route'] || flatSpan.attributes['http.target'];
    const traceId = flatSpan.traceId;

    const isNoise = ['middleware', 'expressInit', 'query', 'cors', 'bodyParser', '<anonymous>']
        .some(str => name.toLowerCase().includes(str.toLowerCase()));

    if (traceId === lastIgnoredTraceId) {
        return null;
    } else if (isNoise) {
        console.log(`   💤 Skipping noise span: "${name}"`);
        return null;
    } else if (file && line) {
        const rootName = staticFnName || name;
        console.log(`   🎯 [MATCH] Found static function: ${rootName} at ${file}:${line}`);
        return { name: rootName, file, line, traceId };
    } else if (method && route && route !== '/*') {
        console.log(`   🎯 [MATCH] Found HTTP route: ${method} ${route}`);
        return { name: `${method} ${route}`, isRoute: true, traceId };
    }

    return null;
}

function _extractPulseData(flatSpan, validSpansForPulse) {
    const file = flatSpan.attributes['shinkei.static.file'];
    const line = flatSpan.attributes['shinkei.static.line'];
    
    if (file && line) {
        validSpansForPulse.push({
            nodeId: `${file}:${line}`,
            name: flatSpan.attributes['shinkei.static.function'] || flatSpan.name,
            rawStartTime: BigInt(flatSpan.startTime),
            durationMs: Number(BigInt(flatSpan.endTime) - BigInt(flatSpan.startTime)) / 1_000_000,
            method: flatSpan.attributes['http.method'] || flatSpan.attributes['http.url'],
            route: flatSpan.attributes['http.route'] || flatSpan.attributes['http.target']
        });
    }
}

function _triggerRealtimeAnalysis(rootCandidate) {
    console.log(`🚀 [Telemetry] Activating analysis for root: ${rootCandidate.name}`);
    waitingForRealtimeRoot = false;
    lastIgnoredTraceId = rootCandidate.traceId;

    try {
        const result = analyzeFunction(
            rootCandidate.name,
            realtimeAnalysisOptions.direction,
            realtimeAnalysisOptions.depth,
            rootCandidate.file
        );

        if (result && !result.error) {
            console.log(`📊 [Telemetry] Analysis successful. Broadcasting graph...`);
            
            // Format numeric flow here or extract to a shared utility
            const idMap = new Map();
            let counter = 0;
            const getNumericId = (id) => {
                if (!idMap.has(id)) idMap.set(id, counter++);
                return idMap.get(id);
            };

            const numericFlow = {
                root: "0",
                nodes: result.fullGraph.nodes.map(n => ({
                    ...n, originalId: n.id, nodeId: n.nodeId, id: String(getNumericId(n.id))
                })),
                edges: result.fullGraph.edges.map(e => ({
                    from: String(getNumericId(e.from)), to: String(getNumericId(e.to))
                }))
            };

            sseService.broadcastGraph({
                flow: numericFlow, trace: result.flow, stats: result.stats,
                telemetry: result.telemetry, meta: result.meta
            });
        } else {
            console.error(`❌ [Telemetry] Analysis failed for ${rootCandidate.name}:`, result?.error || "Unknown error");
            console.log("⏸️ [Telemetry] Analysis failed. Press 'Analyze Next Click' to try again.");
        }
    } catch (analysisErr) {
        console.error(`💥 [Telemetry] Analysis crashed for ${rootCandidate.name}:`, analysisErr.message);
        console.log("⏸️ [Telemetry] Analysis crashed. Press 'Analyze Next Click' to try again.");
    }
}

function _broadcastWaterfallData(validSpansForPulse) {
    const traceStartTime = validSpansForPulse.reduce(
        (min, p) => (p.rawStartTime < min ? p.rawStartTime : min),
        validSpansForPulse[0].rawStartTime
    );

    const waterfallData = validSpansForPulse.map(p => ({
        nodeId: p.nodeId,
        name: p.name,
        durationMs: Number(p.durationMs.toFixed(2)),
        offsetMs: Number(p.rawStartTime - traceStartTime) / 1_000_000,
        method: p.method,
        route: p.route
    })).sort((a, b) => a.offsetMs - b.offsetMs);

    sseService.broadcastPulse(waterfallData);
}

module.exports = {
    enableRealtimeWaiting,
    resetRealtimeState,
    processResourceSpans
};