const path = require('path');
const ts = require('typescript');
const { AnalyzerContext } = require('./context');
const { runExtractors } = require('./extractors/runner');

function analyzeProject(repoPath) {
    const absoluteRepoPath = path.resolve(repoPath);

    // 1. Locate and Read tsconfig.json
    const configPath = ts.findConfigFile(repoPath, ts.sys.fileExists, "tsconfig.json");
    if (!configPath) {
        throw new Error("Could not find tsconfig.json in the repository path.");
    }

    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        repoPath
    );
    
    // 2. Create the Program using ONLY the files found by the config
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const typeChecker = program.getTypeChecker();

    const results = {};
    
    console.log(`⏱️ Analyzing ${parsed.fileNames.length} project files...`);

    // 3. Loop through ONLY the explicit fileNames from tsconfig
    // This ignores the 30k+ internal TS/Node files automatically.
    for (const fileName of parsed.fileNames) {
        const sourceFile = program.getSourceFile(fileName);
        if (!sourceFile) continue;

        // Skip declaration files (.d.ts) even if they were included
        if (sourceFile.isDeclarationFile) continue;

        // Standardize path for the results map
        const absoluteFilePath = path.resolve(fileName);
        
        const context = new AnalyzerContext(sourceFile, typeChecker);

        // Run the extraction suite
        runExtractors(context);

        const data = context.collector.getData();
        results[absoluteFilePath] = data;

        // Log progress (cleanly)
        const relativeLogPath = path.relative(absoluteRepoPath, absoluteFilePath);
        console.log(`✅ INDEXED: ${relativeLogPath}`);
    }

    return results;
}

module.exports = { analyzeProject };
