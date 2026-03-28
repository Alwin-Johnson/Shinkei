// src/utils/fileWalker.js
const fs = require("fs");
const path = require("path");

const SUPPORTED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
const IGNORE_DIRS = new Set([
    "node_modules", ".git", "dist", "build", "coverage", 
    ".next", "out", "public", ".cache", "vendor"
]);

/**
 * Recursively collects target files while preventing symlink loops.
 */
function getAllFiles(dir, results = [], seenDirs = new Set()) {
    // 1. Symlink loop protection
    let realPath;
    try {
        realPath = fs.realpathSync(dir);
    } catch {
        return results; // Skip if access is denied
    }

    if (seenDirs.has(realPath)) return results;
    seenDirs.add(realPath);

    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
        return results;
    }

    for (const entry of entries) {
        if (IGNORE_DIRS.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            getAllFiles(fullPath, results, seenDirs);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (SUPPORTED_EXTENSIONS.includes(ext)) {
                // Normalize to forward slashes strictly
                results.push(fullPath.split(path.sep).join('/'));
            }
        }
    }

    return results;
}

module.exports = { getAllFiles };
