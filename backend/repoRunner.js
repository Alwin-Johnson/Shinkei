const path = require("path");
const { fileWalker } = require("./src/services/fileWalker.services");
const { runParser }  = require("./src/parser/engine/parserEngine");

function printFileSummary(filePath, result) {
    // Improvement 3: Relative path cleanup for cleaner UX
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`\n📄 [FILE] ${relativePath}`);

    // Improvement 2: Handle empty files cleanly
    if (
        !result.imports?.length &&
        !result.functions?.length &&
        !result.calls?.length &&
        !result.apiCalls?.length &&
        !result.routes?.length &&
        !result.events?.length
    ) {
        console.log("  (no relevant data)");
        return;
    }

    // Improvement 4: Sort output by line number for stable, readable logs
    if (result.imports?.length) {
        console.log(`  📦 IMPORTS (${result.imports.length})`);
        result.imports.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(imp => {
            const alias = imp.importedAs !== imp.name ? ` as ${imp.importedAs}` : "";
            console.log(`    - ${imp.name}${alias}  from "${imp.source}"  [${imp.type}]`);
        });
    }

    if (result.functions?.length) {
        console.log(`  ⚙️ FUNCTIONS (${result.functions.length})`);
        result.functions.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(fn => {
            console.log(`    - ${fn.name}  [${fn.type}]  (line ${fn.line})`);
        });
    }

    if (result.calls?.length) {
        console.log(`  📞 CALLS (${result.calls.length})`);
        result.calls.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(c => {
            console.log(`    - ${c.from} → ${c.callee}  [${c.type}]  (line ${c.line})`);
        });
    }

    if (result.apiCalls?.length) {
        console.log(`  🌐 API CALLS (${result.apiCalls.length})`);
        result.apiCalls.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(api => {
            console.log(`    - ${api.method} ${api.url}  [${api.lib}]  (line ${api.line})`);
        });
    }

    if (result.routes?.length) {
        console.log(`  🛣️ ROUTES (${result.routes.length})`);
        result.routes.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(r => {
            console.log(`    - ${r.method} ${r.path}  handler:${r.handler}  (line ${r.line})`);
        });
    }

    if (result.events?.length) {
        console.log(`  🖱️ EVENTS (${result.events.length})`);
        result.events.sort((a, b) => (a.line || 0) - (b.line || 0)).forEach(e => {
            console.log(`    - ${e.event} on <${e.element}> → ${e.handler}  (line ${e.line})`);
        });
    }
}

function runOnRepo(repoPath, options = { verbose: true }) {
    const files = fileWalker(repoPath);
    let passed = 0;
    let failed = 0;

    const summary = {
        files: 0,
        imports: 0,
        functions: 0,
        calls: 0,
        apis: 0,
        routes: 0,
        events: 0,
    };

    console.log("\n========================================");
    console.log(` 🧠 SHINKEI PARSER RUNNER `);
    console.log(` 📂 Target: ${path.relative(process.cwd(), repoPath) || repoPath}`);
    console.log(` 📄 Found: ${files.length} files`);
    console.log("========================================\n");

    for (const filePath of files) {
        const result = runParser(filePath);

        // Improvement 1: Stronger validation schema
        if (
            !result || 
            typeof result !== "object" || 
            !Array.isArray(result.functions) || 
            !Array.isArray(result.calls)
        ) {
            console.log(`❌ [FAILED] ${path.relative(process.cwd(), filePath)} (Invalid Output)\n`);
            failed++;
            continue;
        }

        passed++;
        summary.files++;
        
        // Count facts safely
        summary.imports   += result.imports?.length || 0;
        summary.functions += result.functions?.length || 0;
        summary.calls     += result.calls?.length || 0;
        summary.apis      += result.apiCalls?.length || 0;
        summary.routes    += result.routes?.length || 0;
        summary.events    += result.events?.length || 0;

        if (options.verbose) {
            printFileSummary(filePath, result);
        }
    }

    console.log("\n========================================");
    console.log(" 📊 GLOBAL SUMMARY");
    console.log("========================================");
    console.log(`  Files      : ${passed} ok / ${failed} failed`);
    console.log(`  Imports    : ${summary.imports}`);
    console.log(`  Functions  : ${summary.functions}`);
    console.log(`  Calls      : ${summary.calls}`);
    console.log(`  APIs       : ${summary.apis}`);
    console.log(`  Routes     : ${summary.routes}`);
    console.log(`  Events     : ${summary.events}`);
    console.log("========================================\n");
}

module.exports = { runOnRepo };