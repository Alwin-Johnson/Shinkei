const { fetchRepoAsZip, stopActiveProcesses, clearTempFolder } = require("../utils/githubZipHandler");
const { index } = require("../services/indexBuilder"); 
const { analyzeFunction } = require("../services/queryEngine");
const dynamicStore = require("../services/dynamicStore");
const { resetRealtimeState } = require("./telemetryController");

function isValidGithubRepoUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") {
        return false;
    }

    const trimmed = rawUrl.trim();
    if (!trimmed) {
        return false;
    }

    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        const parsed = new URL(normalized);
        const hostname = parsed.hostname.toLowerCase();
        if (hostname !== "github.com" && hostname !== "www.github.com") {
            return false;
        }

        const segments = parsed.pathname.split("/").filter(Boolean);
        if (segments.length < 2) {
            return false;
        }

        const owner = segments[0];
        const repo = segments[1].replace(/\.git$/i, "");
        const segmentPattern = /^[A-Za-z0-9_.-]+$/;

        return Boolean(owner && repo && segmentPattern.test(owner) && segmentPattern.test(repo));
    } catch (e) {
        return false;
    }
}

exports.analyzeRepo = async (req, res) => {
    try {
        const { repoUrl, entryFunction, direction, depth, options } = req.body;

        if (!repoUrl) {
            return res.status(400).json({
                success: false,
                error: "repoUrl is required.",
            });
        }

        if (!isValidGithubRepoUrl(repoUrl)) {
            return res.status(400).json({
                success: false,
                error: "Invalid repoUrl. Expected github.com/owner/repo.",
            });
        }

        const directionSafe = direction === "backward" ? "backward" : "forward";
        const depthSafe = (depth && Number.isInteger(Number(depth)) && Number(depth) > 0)
            ? Number(depth)
            : 8;

        console.log(`🔍 Starting analysis for: ${repoUrl}`);
        
        // 🟢 UPDATE: Only run dynamic tracing if we are in Real-time mode (no entryFunction)
        const isRealtimeMode = !entryFunction;
        const repoPath = await fetchRepoAsZip(repoUrl, isRealtimeMode, options); 
        
        // 1. BUILD STEP (Static AST Indexing)
        await index.build(repoPath);

        // 2. CHECK MODE: Static or Real-time?
        if (isRealtimeMode) {
            // 🟢 REAL-TIME MODE
            console.log("📡 No entry function provided. Entering Real-time mode.");
            // ⛔ Removed auto-arming: telemetryRoutes.enableRealtimeWaiting(...)

            return res.json({
                success: true,
                mode: "realtime",
                message: "Environment ready. Use 'Analyze Next Click' to start capturing."
            });
        }

        // 3. ANALYZE STEP (Static Mode)
        const result = analyzeFunction(
            entryFunction,
            directionSafe,
            depthSafe
        );

        if (!result || result.error) {
            return res.status(404).json({
                success: false,
                error: result?.error ?? `Could not analyze "${entryFunction}".`,
            });
        }

        // ── FORMATTER HELPER ──────────────────────────────────────────────
        const formatToNumericFlow = (nodes, edges) => {
            const idMap = new Map();
            let counter = 0;

            const getNumericId = (originalId) => {
                if (!idMap.has(originalId)) {
                    idMap.set(originalId, counter++);
                }
                return idMap.get(originalId);
            };

            return {
                root: "0",
                nodes: nodes.map(n => ({
                    ...n,
                    originalId: n.id,
                    nodeId: n.nodeId,
                    id: String(getNumericId(n.id)), 
                })),
                edges: edges.map(e => ({
                    from: String(getNumericId(e.from)),
                    to:   String(getNumericId(e.to)),
                })),
            };
        };
        const numericFlow = formatToNumericFlow(result.fullGraph.nodes, result.fullGraph.edges);

        // ── FINAL RESPONSE ────────────────────────────────────────────────
        return res.json({ 
            success: true, 
            mode: "static",
            flow: numericFlow, 
            trace: result.flow, 
            stats: result.stats,
            telemetry: result.telemetry,
            meta: result.meta
        });

    } catch (err) {
        console.error("[analyze] crash:", err.stack);
        return res.status(500).json({
            success: false,
            error: "Failed to analyze repo: " + err.message,
        });
    }
};

exports.stopAnalysis = async (req, res) => {
    try {
        await stopActiveProcesses();
        await clearTempFolder();
        dynamicStore.reset();
        resetRealtimeState();
        index._reset(); 
        res.json({ success: true, message: "Analysis stopped and environment cleared." });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

