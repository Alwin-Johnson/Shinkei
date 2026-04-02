// scripts/test-parser.js
const { index } = require('./src/services/indexBuilderNew'); // Ensure path is correct
const path = require('path');
const queryEngine = require('./src/services/queryEngine');
async function test() {
    const targetRepo = path.resolve(__dirname, '../');
    console.log(`📂 Testing Repo: ${targetRepo}`);
    console.log("--- Starting Analysis ---");

    await index.build(targetRepo);
    console.log("Total Events in Index:", index.events.size);
// Manually check if the key exists
const eventKeys = Array.from(index.events.keys());
console.log("Available Event IDs:", eventKeys.slice(0, 5));
    // 1. Show Global Stats Table
    console.log("\n📊 Global Stats:");
    console.table({
        "Total Files": index.files.size,
        "Total Functions": index.functionsById.size,
        "Total Routes": index.routes.size,
        "Total API Calls": index.apiCalls.length,
        "Total Events": index.events.size
    });

    // 2. Sample API Calls
    if (index.apiCalls.length > 0) {
        console.log("\n📡 Sample API Calls (First 3):");
        index.apiCalls.slice(0, 3).forEach(api => {
            console.log(`   [${api.method}] ${api.url} in ${api.file}`);
        });
    }

    // 3. Sample Events
    if (index.events.size > 0) {
        console.log("\n🖱️  Sample Events (First 3):");
        Array.from(index.events.values()).slice(0, 3).forEach(ev => {
            console.log(`   ${ev.event} on <${ev.element}> -> handler: ${ev.handler || 'unknown'} (${ev.file})`);
        });
    }

    // 4. Function Lookup Test
    const funcArray = Array.from(index.functionsById.values());
    if (funcArray.length > 3) {
        const sample = funcArray[3];
        console.log("\n🔍 Function Lookup Test:");
        console.log(`   ID: ${sample.id}`);
        console.log(`   Data:`, index.functionsById.get(sample.id));
    }
    const result = queryEngine.analyzeFunction("onAnalyze:WorkspaceModal");
console.log("FLOW DETECTED:", JSON.stringify(result.flow, null, 2));
console.log("STATS:", result.stats);
}

test().catch(err => {
    console.error("\n💥 Test Failed:");
    console.error(err);
});
