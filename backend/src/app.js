const express = require("express");
const cors = require("./config/cors");
const errorHandler = require("./middlewares/errorHandler");

const analyzeRoutes = require("./routes/analyzeRoutes");
const codeExplainRoutes = require("./routes/codeExplainRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const editorRoutes = require("./routes/editor.routes");

const app = express();

app.use(cors);
app.use((req, res, next) => {
    console.log(`📡 [API] ${req.method} ${req.url}`);
    next();
});

// Increase limit for trace payloads (OTel batches can be large)
app.use(express.json({ limit: '5mb' })); 

// 👉 API routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api", codeExplainRoutes);


// 👉 Shinkei Telemetry Ingest
app.use("/api/shinkei", telemetryRoutes);
app.use("/api/editor", editorRoutes);


module.exports = app;
