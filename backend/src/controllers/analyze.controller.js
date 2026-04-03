const { fetchRepoAsZip } = require("../utils/githubZipHandler");
const { index } = require("../services/indexBuilder"); 
const { analyzeFunction } = require("../services/queryEngine");

exports.analyzeRepo = async (req, res) => {
    try {
        const { repoUrl, entryFunction, direction, depth } = req.body;

        if (!repoUrl || !entryFunction) {
            return res.status(400).json({
                success: false,
                error: "repoUrl and entryFunction are required.",
            });
        }

        const directionSafe = direction === "backward" ? "backward" : "forward";
        const depthSafe = (depth && Number.isInteger(Number(depth)) && Number(depth) > 0)
            ? Number(depth)
            : null;

        // 🟢 UPDATE 1: Pass 'true' to trigger OpenTelemetry injection
        console.log(`🔍 Starting analysis for: ${repoUrl}`);
        const repoPath = await fetchRepoAsZip(repoUrl, true); 
        
        // 1. BUILD STEP
        await index.build(repoPath);

        // 2. ANALYZE STEP 
        // This now returns { flow, fullGraph, stats, telemetry, meta }
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
        root: "0", // Keeping root consistent with numeric strings
        nodes: nodes.map(n => ({
            ...n,
            originalId: n.id,
            // Create the searchable ID for Telemetry pulses
            nodeId: n.nodeId,
            // The numeric ID used for the layout engine positions
            id: getNumericId(n.id), 
        })),
        edges: edges.map(e => ({
            from: getNumericId(e.from),
            to:   getNumericId(e.to),
        })),
    };
};
        const numericFlow = formatToNumericFlow(result.fullGraph.nodes, result.fullGraph.edges);

        // ── FINAL RESPONSE ────────────────────────────────────────────────
        return res.json({ 
            success: true, 
            flow: numericFlow, 
            trace: result.flow, 
            stats: result.stats,
            telemetry: result.telemetry, // 🟢 UPDATE 2: Expose OTel data to Frontend
            meta: result.meta            // 🟢 UPDATE 3: Expose meta (entryType, etc.)
        });

    } catch (err) {
        console.error("[analyze] crash:", err.message);
        return res.status(500).json({
            success: false,
            error: "Failed to analyze repo: " + err.message,
        });
    }
};
