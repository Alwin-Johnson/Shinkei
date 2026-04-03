const express = require('express');
const router = express.Router();
const dynamicStore = require('../services/dynamicStore');

// ─── 📡 SSE CLIENT MANAGEMENT ──────────────────────────────────────────
let clients = []; 

function broadcastPulse(spansArray) {
    if (clients.length === 0) return;

    const message = `data: ${JSON.stringify({ type: 'pulse_batch', spans: spansArray })}\n\n`;

    clients.forEach(client => {
        // ✅ FIX: Access the .res property of the client object
        try {
            client.res.write(message);
        } catch (err) {
            console.error("Failed to write to client:", err);
        }
    });
} 

// ─── 📡 SSE ENDPOINT ──────────────────────────────────────────────────
router.get('/v1/stream', (req, res) => {
    // 1. Set headers for SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*', 
        'X-Accel-Buffering': 'no' 
    });

    // 2. Immediate handshake
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // 3. Track client
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    // 4. Cleanup on disconnect
    req.on('close', () => {
        clients = clients.filter(c => c.id !== clientId);
    });
});

// ─── 📥 INGESTION & WATERFALL ENGINE ──────────────────────────────────
router.post('/v1/traces', (req, res) => {
    try {
        const resourceSpans = req.body.resourceSpans || [];
        let spanCount = 0;
        const validSpansForPulse = []; 

        resourceSpans.forEach(resource => {
            resource.scopeSpans.forEach(scope => {
                scope.spans.forEach(span => {
                    spanCount++;
                    
                    const flatSpan = {
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

                    dynamicStore.addSpan(flatSpan);

                    const file = flatSpan.attributes['shinkei.static.file'];
                    const line = flatSpan.attributes['shinkei.static.line'];
                    const name = flatSpan.name || "";

                    const isNoise = ['middleware', 'expressInit', 'query', 'cors', 'bodyParser', '<anonymous>']
                        .some(str => name.toLowerCase().includes(str.toLowerCase()));

                    if (file && line && !isNoise) {
                        validSpansForPulse.push({
                            nodeId: `${file}:${line}`,
                            name: name,
                            rawStartTime: BigInt(flatSpan.startTime),
                            durationMs: Number(BigInt(flatSpan.endTime) - BigInt(flatSpan.startTime)) / 1_000_000,
                            method: flatSpan.attributes['http.method'],
                            route: flatSpan.attributes['http.route']
                        });
                    }
                });
            });
        });

        // WATERFALL SORTING
        if (validSpansForPulse.length > 0) {
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

            broadcastPulse(waterfallData);
        }

        res.status(200).send('Traces ingested');
    } catch (err) {
        console.error('❌ [Telemetry] Error:', err.message);
        res.status(500).send('Ingestion error');
    }
});

module.exports = router;
