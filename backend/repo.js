/**
 * test-full-index.js
 * Tests the IndexBuilder crawler using the ParserEngine pipeline.
 */
const { index } = require('./src/services/indexBuilder'); // Adjust path to your indexBuilder
const path = require('path');

async function testFullBuild() {
    // 1. Point to the root of the backend repository you want to map
    const targetRepo = path.resolve(__dirname, '../'); 

    console.log(`📂 Target Repository: ${targetRepo}`);
    console.log("--------------------------------------------------");
    console.log("⏱️  Starting Full Index Build...");
    
    const startTime = Date.now();

    try {
        // 2. Trigger the Crawler
        // This will call runParser() for every file found by fileWalker
        await index.build(targetRepo);

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log("--------------------------------------------------");
        console.log(`✅ Build Complete in ${duration}s`);
        
        // 3. Show all files found (Relative Paths)
        const fileList = Array.from(index.files.keys());
        console.log(`\n📄 Files Indexed (${fileList.length}):`);
        fileList.forEach(file => console.log(`   - ${file}`));

        // 4. Show Global Stats
// 4. Show Global Stats
        console.log("\n📊 Global Index Stats:");
        console.table({
            "Total Files": index.files.size,
            "Total Functions": index.functionsById.size,
            "Total Routes": index.routes.size,
            "Total API Calls": index.apiCalls.length, // Added this
            "Total Events": index.events.length
        });

        // 5. Sample a Function Lookup
        if (index.functionsById.size > 0) {
            const sampleId = Array.from(index.functionsById.keys())[0];
            const sampleFn = index.functionsById.get(sampleId);
            
            console.log("\n🔍 Sample Function Lookup:");
            console.log(`   ID:   ${sampleId}`);
            console.log(`   Name: ${sampleFn.name}`);
            console.log(`   File: ${sampleFn.file}`);
        }
        // 6. Sample Route Lookups
        if (index.routes.size > 0) {
            console.log("\n🛣️  Sample Routes (First 5):");
            const sampleRoutes = Array.from(index.routes.values()).slice(0, 5);
            sampleRoutes.forEach(r => {
                console.log(`   [${r.method}] ${r.path} -> ${r.file} (Line ${r.line})`);
            });
        }

        // 7. Sample API Call Lookups (Frontend -> Backend)
        if (index.apiCalls.length > 0) {
            console.log("\n📡 Sample API Calls (First 5):");
            index.apiCalls.slice(0, 5).forEach(api => {
                console.log(`   [${api.method}] ${api.url} called in ${api.file}`);
            });
        }

        // 8. Sample Event Lookups (UI Interactions)
        if (index.events.length > 0) {
            console.log("\n🖱️  Sample UI Events (First 5):");
            index.events.slice(0, 5).forEach(ev => {
                console.log(`   ${ev.eventName} -> ${ev.handlerName} in ${ev.component} (${ev.file})`);
            });
        }

    } catch (err) {
        console.error("\n💥 Index Build Failed:");
        console.error(err);
    }
}

testFullBuild();
