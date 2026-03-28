/**
 * collector.js
 *
 * PURE STORAGE LAYER — nothing else.
 *
 * Responsibilities:
 *  ✅ store data given by extractors
 *  ✅ provide add methods for each data type
 *  ✅ provide a clean getData() snapshot
 *
 * Does NOT:
 *  ❌ traverse AST
 *  ❌ detect any patterns
 *  ❌ contain any extraction logic
 *  ❌ track scope or function stack
 *
 * Data flow:
 *   parserEngine → runs extractors → extractors call collector.addX() → analyzer reads getData()
 */

function createCollector(filePath) {
    const data = {
        file:      filePath,
        functions: [],   // filled by functions.extractor
        calls:     [],   // filled by calls.extractor
        apiCalls:  [],   // filled by apiCalls.extractor
        routes:    [],   // filled by routes.extractor
        events:    [],   // filled by events.extractor
        imports:   [],   // filled by imports.extractor
    };

    return {

        // ── functions.extractor calls this ───────────────────────────────
        addFunction(entry) {
            data.functions.push({ ...entry, file: filePath });
        },

        // ── calls.extractor calls this ────────────────────────────────────
        addCall(entry) {
            data.calls.push({ ...entry, file: filePath });
        },

        // ── apiCalls.extractor calls this ─────────────────────────────────
        addApiCall(entry) {
            data.apiCalls.push({ ...entry, file: filePath });
        },

        // ── routes.extractor calls this ───────────────────────────────────
        addRoute(entry) {
            data.routes.push({ ...entry, file: filePath });
        },

        // ── events.extractor calls this ───────────────────────────────────
        addEvent(entry) {
            data.events.push({ ...entry, file: filePath });
        },

        // ── imports.extractor calls this ──────────────────────────────────
        addImport(entry) {
            data.imports.push({ ...entry, file: filePath });
        },

        // ── parserEngine calls this at the end ────────────────────────────
        getData() {
            return data;
        },
    };
}

module.exports = { createCollector };