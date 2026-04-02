const { fetchRepoAsZip } = require("../utils/githubZipHandler");
const { IndexBuilder } = require("../services/indexBuilderNew"); 
const { analyzeFunction } = require("../services/queryEngineNew");

exports.analyzeRepo = async (req, res) => {
    try {
        const { repoUrl, entryFunction: query, direction, depth } = req.body;

        if (!repoUrl || !query) {
            return res.status(400).json({
                success: false,
                error: "repoUrl and entryFunction (query) are required.",
            });
        }

        const directionSafe = direction === "backward" ? "backward" : "forward";
        const depthSafe = (depth && Number.isInteger(Number(depth)) && Number(depth) > 0) ? Number(depth) : null;

        console.log(`[Controller] Fetching repo: ${repoUrl}`);
        const repoPath = await fetchRepoAsZip(repoUrl);
        
        console.log(`[Controller] Parsing and indexing AST...`);
        // We capture the specific index returned by the parser
        const builder = new IndexBuilder(); 

    // 2. Run the build process (this fills the internal Maps)
    const projectIndex = await builder.build(repoPath);

        console.log(`[Controller] Analyzing query: "${query}"`);
        // We pass the captured index into the engine
        const result = analyzeFunction(projectIndex, query, directionSafe, depthSafe);

        if (!result || result.error) {
            return res.status(404).json({
                success: false,
                error: result?.error ?? `Could not resolve or analyze "${query}".`,
            });
        }

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
                root: 0, 
                nodes: nodes.map(n => ({
                    ...n,             
                    originalId: n.id, 
                    id: getNumericId(n.id),
                })),
                edges: edges.map(e => ({
                    from: getNumericId(e.from),
                    to:   getNumericId(e.to),
                })),
            };
        };

        const numericFlow = formatToNumericFlow(result.fullGraph.nodes, result.fullGraph.edges);

        return res.json({ 
            success: true, 
            graph: numericFlow,     
            trace: result.flow,     
            stats: result.stats,    
            meta: result.meta       
        });

    } catch (err) {
        console.error("[analyzeRepo] crash:", err);
        return res.status(500).json({
            success: false,
            error: "Failed to analyze repo: " + err.message,
        });
    }
};
