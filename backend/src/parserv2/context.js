const { Collector } = require('./collector');

class AnalyzerContext {
    constructor(sourceFile, typeChecker) {
        this.sourceFile = sourceFile;
        this.typeChecker = typeChecker;
        this.collector = new Collector(sourceFile.fileName);
    }
}

module.exports = { AnalyzerContext };
