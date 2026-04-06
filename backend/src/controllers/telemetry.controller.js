const telemetryService = require('../services/telemetry.service');
const sseService = require('../services/sseService');

exports.resetRealtime = (req, res) => {
    console.log("♻️ [Telemetry] Manual reset requested. Clearing filters.");
    telemetryService.resetRealtimeState();
    telemetryService.enableRealtimeWaiting(req.body);
    return res.json({ success: true, message: "Ready for next interaction." });
};

exports.stream = (req, res) => {
    // SSE connection handling
    sseService.addClient(req, res);
};

exports.ingestTraces = (req, res) => {
    try {
        const resourceSpans = req.body.resourceSpans || [];
        
        // 1. Acknowledge the OTLP exporter immediately to prevent timeouts
        res.status(200).send('Traces ingested');

        // 2. Process the heavy payload in the background
        setImmediate(() => {
            telemetryService.processResourceSpans(resourceSpans);
        });

    } catch (err) {
        console.error('❌ [Telemetry Controller] Error:', err.message);
        if (!res.headersSent) {
            res.status(500).send('Ingestion error');
        }
    }
};