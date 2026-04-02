const { analyzeProject } = require("./engine");

/**
 * Public API for the Deep Analysis Parser.
 * @param {string} repoPath - Root of the repo (must contain tsconfig.json)
 */
async function analyze(repoPath) {
    try {
        const results = analyzeProject(repoPath);
        return results;
    } catch (error) {
        console.error("[parserv2] Analysis failed:", error);
        throw error;
    }
}

module.exports = { analyze };
