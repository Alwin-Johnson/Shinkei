const fs = require("fs");
const path = require("path");
const globalIndex = require("./analyzer.service");

/**
 * code.service.js
 *
 * Responsibility: Fetch raw source code for a given function.
 */

// 🔥 FIX 4: In-memory cache to prevent slow disk reads on repeated UI clicks
const fileCache = new Map();

exports.getFunctionCodeSnippet = (fnName) => {
    // 1. Ensure repository is analyzed and path is known
    if (!globalIndex.repoPath) {
        throw new Error("Repository has not been analyzed yet. Run POST /analyze first.");
    }

    // 2. Ask analyzer for the function's location
    let fnInfo = globalIndex.findFunction(fnName);
    if (!fnInfo) {
        throw new Error(`Function "${fnName}" not found in the index.`);
    }

    // 🔥 FIX 1: Safeguard — if index returns an array of multiple matches, take the first one
    if (Array.isArray(fnInfo)) {
        fnInfo = fnInfo[0]; 
    }

    // 🔥 FIX 2: Strict validation — do not guess line 1 if the extractor failed
    if (!fnInfo.startLine) {
        throw new Error(`Missing startLine data for function "${fnName}". Cannot accurately extract code.`);
    }

    // 3. Resolve absolute path
    const absolutePath = path.join(globalIndex.repoPath, fnInfo.file);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Source file not found on disk: ${fnInfo.file}`);
    }

    // 4. Read file (Using Cache)
    let fileContent;
    if (fileCache.has(absolutePath)) {
        fileContent = fileCache.get(absolutePath);
    } else {
        fileContent = fs.readFileSync(absolutePath, "utf-8");
        fileCache.set(absolutePath, fileContent);
    }

    const lines = fileContent.split("\n");

    // 🔥 FIX 3: Exact boundary slicing
    // Array is 0-indexed. If startLine is 10, index is 9.
    const startIdx = fnInfo.startLine - 1;
    
    // slice(start, end) is EXCLUSIVE of the end index. 
    // If endLine is 25, passing 25 to slice() grabs up to index 24 (which IS line 25).
    const endIdx = fnInfo.endLine ? fnInfo.endLine : lines.length;

    const codeSnippet = lines.slice(startIdx, endIdx).join("\n");

    return {
        function: fnName,
        file: fnInfo.file,
        startLine: fnInfo.startLine,
        endLine: fnInfo.endLine,
        code: codeSnippet
    };
};

/**
 * Utility to clear cache when a new repository is analyzed
 */
exports.clearCache = () => {
    fileCache.clear();
};