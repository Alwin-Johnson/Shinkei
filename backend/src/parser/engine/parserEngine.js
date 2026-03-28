const { parseFile }       = require("../parseFile");
const { ParserContext }   = require("./context");
const { createCollector } = require("./collector");

const functionsExtractor = require("../extractors/functions.extractor");
const callsExtractor     = require("../extractors/calls.extractor");
const apiCallsExtractor  = require("../extractors/apiCalls.extractor");
const routesExtractor    = require("../extractors/routes.extractor");
const eventsExtractor    = require("../extractors/events.extractor");
const importsExtractor   = require("../extractors/imports.extractor");

/**
 * parserEngine.js
 *
 * THE WIRING LAYER — connects parseFile → extractors → collector.
 *
 * Responsibilities:
 *  ✅ parse file → AST
 *  ✅ create context (ast + filePath)
 *  ✅ create collector (empty storage)
 *  ✅ run each extractor (each does its own traversal)
 *  ✅ feed results into collector
 *  ✅ return collector.getData()
 *
 * Does NOT:
 *  ❌ traverse AST itself
 *  ❌ extract any patterns
 *  ❌ manage function scope or stack
 *
 * WHY EXTRACTORS HANDLE THEIR OWN TRAVERSAL:
 *  Each extractor computes getCurrentFunction() via live path.parentPath
 *  walking during its own traversal. This is accurate and self-contained.
 *  No shared traversal or context stack needed.
 *
 * Data flow:
 *  runParser(filePath)
 *    → parseFile → AST
 *    → ParserContext { ast, filePath }
 *    → createCollector()
 *    → each extractor.extract(context) → returns array
 *    → collector.addX() for each result
 *    → return collector.getData()
 */

function runParser(filePath) {
    // 1. parse file → AST
    const ast = parseFile(filePath);
    if (!ast) return null;

    // 2. create context + collector
    const context   = new ParserContext(ast, filePath);
    const collector = createCollector(filePath);

    // 3. run each extractor — each returns an array of results
    const functions = functionsExtractor.extract(context);
    const calls     = callsExtractor.extract(context);
    const apiCalls  = apiCallsExtractor.extract(context);
    const routes    = routesExtractor.extract(context);
    const events    = eventsExtractor.extract(context);
    const imports   = importsExtractor.extract(context);

    // 4. feed into collector
    functions.forEach(e => collector.addFunction(e));
    calls.forEach(e     => collector.addCall(e));
    apiCalls.forEach(e  => collector.addApiCall(e));
    routes.forEach(e    => collector.addRoute(e));
    events.forEach(e    => collector.addEvent(e));
    imports.forEach(e   => collector.addImport(e));

    // 5. return clean structured data
    return collector.getData();
}

module.exports = { runParser };