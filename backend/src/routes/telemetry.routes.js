const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetry.controller.js');

// ─── 📡 ROUTES ────────────────────────────────────────────────────────

router.post('/v1/reset', telemetryController.resetRealtime);
router.get('/v1/stream', telemetryController.stream);
router.post('/v1/traces', telemetryController.ingestTraces);

module.exports = router;