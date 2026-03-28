const path = require("path");

/**
 * context.js
 *
 * SIMPLE DATA HOLDER — shared across all extractors for one file parse.
 *
 * Holds:
 *  ✅ ast         → the parsed AST (used by every extractor)
 *  ✅ filePath    → absolute path to the file being parsed
 *  ✅ fileName    → just the filename (Login.jsx)
 *
 * Does NOT:
 *  ❌ track function stack (extractors handle this via parentPath walking)
 *  ❌ traverse AST
 *  ❌ store results
 *
 * WHY NO STACK:
 *  Each extractor runs its own traversal and computes getCurrentFunction()
 *  via live path.parentPath walking during that traversal.
 *  A context-level stack only works if all extractors share ONE traversal.
 *  They don't — so the stack was dead weight. Removed.
 */

class ParserContext {
    constructor(ast, filePath) {
        this.ast      = ast;
        this.filePath = filePath;
        this.fileName = path.basename(filePath);
    }
}

module.exports = { ParserContext };