const { analyzeProject } = require('./backend/src/parserv2/engine'); // Adjust path as needed
const path = require('path');

async function debugFunctions() {
    const repoPath = '/home/abdulla/Shinkei/backend/temp/testshinkei-1775048061279/dheeraj20064-testshinkei-22a4cfb'; // Your project root
    const results = analyzeProject(repoPath);

    console.log('\n--- 📜 ALL DISCOVERED FUNCTIONS ---');
    
    let totalCount = 0;

    // 1. Iterate through each file in the results
    for (const [filePath, fileData] of Object.entries(results)) {
        if (fileData.functions && fileData.functions.length > 0) {
            const relativePath = path.relative(repoPath, filePath);
            
            console.log(`\n📁 File: ${relativePath}`);
            
            // 2. Sort functions by line number for easier reading
            const sortedFunctions = fileData.functions.sort((a, b) => a.startLine - b.startLine);

            sortedFunctions.forEach(fn => {
                totalCount++;
                const asyncTag = fn.isAsync ? '[async]' : '';
                const exportTag = fn.isExported ? '[exported]' : '';
                
                console.log(`  Line ${fn.startLine.toString().padEnd(4)} | ƒ ${fn.name.padEnd(25)} ${asyncTag.padEnd(8)} ${exportTag}`);
            });
        }
    }

    console.log('\n----------------------------------------');
    console.log(`✅ Total Functions Indexed: ${totalCount}`);
    console.log('----------------------------------------\n');
}

debugFunctions();
