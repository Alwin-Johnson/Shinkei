const fs = require("fs");
const parser = require("@babel/parser");

/**
 * parseFile.js
 *
 * Responsibility:
 * - Read file content
 * - Convert code → AST using Babel
 *
 * Guarantees:
 * - Supports modern JS, JSX, TS
 * - Handles both ES modules + CommonJS
 * - Never crashes pipeline (safe fallback)
 */
function parseFile(filePath) {
    try {
        const code = fs.readFileSync(filePath, "utf-8");

        const ast = parser.parse(code, {
            sourceType: "unambiguous", // auto-detect module vs commonjs
            plugins: [
                "jsx",                         // React JSX
                "typescript",                  // TS support

                // Modern JS features (IMPORTANT)
                "classProperties",
                "classPrivateProperties",
                "classPrivateMethods",
                "dynamicImport",
                "optionalChaining",
                "nullishCoalescingOperator",
                "objectRestSpread",
                "topLevelAwait",
            ],
        });

        return ast;
    } catch (err) {
        console.warn(`[parseFile] Failed to parse: ${filePath} — ${err.message}`);
        return null;
    }
}

module.exports = { parseFile };