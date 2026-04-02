const ts = require('typescript');
const fnExtractor = require('./functions');
const callExtractor = require('./calls');
const importExtractor = require('./imports');
const routeExtractor = require('./routes');

// New Extractors
const apiExtractor = require('./apiCalls'); 
const eventExtractor = require('./events');

function runExtractors(context) {
    const { sourceFile } = context;

    function walk(node) {
        // 1. Core Logic Extractors
        importExtractor(node, context);
        fnExtractor(node, context);
        callExtractor(node, context);
        routeExtractor(node, context);

        // 2. New Logic: API and Frontend Events
        // We pass the node to these new modules just like the others
        apiExtractor(node, context);
        eventExtractor(node, context);

        // 3. Recursively visit children
        ts.forEachChild(node, walk);
    }

    walk(sourceFile);
}

module.exports = { runExtractors };
