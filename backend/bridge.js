const { index } = require('./src/services/indexBuilderNew');
const queryEngine = require('./src/services/queryEngineNew');
const path = require('path');

async function runBridgeTest() {
    const targetRepo = path.resolve(__dirname, '../'); // Points to Shinkei root
    
    console.log("📂 Target Repository:", targetRepo);
    console.log("--------------------------------------------------");
    console.log("⏱️  Building AST Index...");
    
    // 1. Build the index (Essential for the singleton to have data)
    await index.build(targetRepo);
    
    console.log(`✅ Index Ready: ${index.functionsById.size} functions, ${index.events.size} events.`);
    console.log("--------------------------------------------------\n");

    // 2. TEST CASE A: Trace from a UI Event (Frontend -> Backend)
    // This is the "Holy Grail" test. It should find the handler, 
    // see the fetch() call, and jump to the Express route.
    console.log("🔍 TEST A: Tracing 'onAnalyze' from WorkspaceModal");
    const uiFlow = queryEngine.analyzeFunction("analyzeRepo");

    if (uiFlow.error) {
        console.error("❌ Test A Failed:", uiFlow.error);
    } else {
        renderFlow(uiFlow);
    }

    console.log("\n--------------------------------------------------");

    // 3. TEST CASE B: Trace from a Backend Route
    console.log("🔍 TEST B: Tracing 'POST /api/analyze'");
    const routeFlow = queryEngine.analyzeFunction("POST /api/analyze");

    if (routeFlow.error) {
        console.error("❌ Test B Failed:", routeFlow.error);
    } else {
        renderFlow(routeFlow);
    }
}

/**
 * Helper to print the flow in a readable way
 */
function renderFlow(result) {
    console.log(`🚀 Found Flow: ${result.meta.entryName || result.meta.route?.path}`);
    console.log(`📊 Steps: ${result.flow.length} | Layer: ${result.meta.entryType}`);
    
    result.flow.forEach((step, i) => {
        const indent = "  ".repeat(i);
        const typeIcon = step.type === 'api' ? '📡' : step.type === 'event' ? '🖱️' : 'ƒ';
        console.log(`${indent}${i + 1}. ${typeIcon} [${step.type.toUpperCase()}] ${step.label} (${step.file}:${step.startLine})`);
    });

    if (result.meta.apiCalls?.length > 0) {
        console.log(`\n🔗 Network Bridges Found:`);
        result.meta.apiCalls.forEach(call => {
            console.log(`   -> Calls: ${call.method} ${call.url}`);
        });
    }
}

runBridgeTest().catch(err => {
    console.error("💥 Critical Failure:", err);
});
