const express = require("express");
const cors = require("./config/cors");

const analyzeRoutes = require("./routes/analyze.routes");
const explainRoutes = require("./routes/code.explain.routes");
const telemetryRoutes = require("./routes/telemetry.routes"); // Renamed for clarity

const app = express();

app.use(cors);

// Increase limit for trace payloads (OTel batches can be large)
app.use(express.json({ limit: '5mb' })); 

// 👉 API routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api", explainRoutes);

// 👉 Shinkei Telemetry Ingest
// This matches your tracing.js config: http://localhost:PORT/api/shinkei/v1/traces
app.use("/api/shinkei", telemetryRoutes);

module.exports = app;
