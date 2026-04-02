// parserv2/extractors/calls.js
const ts = require('typescript');
const { getLine, getSafeName } = require('../utils/ast-helpers');
const { makeFunctionId } = require('../utils/ids');

module.exports = function extractCalls(node, context) {
    const { collector, sourceFile, typeChecker } = context;

    if (ts.isCallExpression(node)) {
        // 1. Find the Enclosing Function (The Caller)
        let parent = node.parent;
        let callerNode = null;

        while (parent) {
            if (ts.isFunctionDeclaration(parent) || 
                ts.isMethodDeclaration(parent) || 
                ts.isArrowFunction(parent)) {
                callerNode = parent;
                break;
            }
            parent = parent.parent;
        }

        // 2. Generate the ID for the caller
        const callerId = callerNode 
            ? makeFunctionId(sourceFile.fileName, getSafeName(callerNode), getLine(callerNode, sourceFile))
            : "top-level";

        // 3. Identify the Target (What is being called?)
        // The TypeChecker looks across your whole project to find the definition
        const symbol = typeChecker.getSymbolAtLocation(node.expression);
        let targetFile = "unknown";
        let targetName = node.expression.getText(sourceFile);

        if (symbol) {
            const declaration = symbol.valueDeclaration || symbol.declarations?.[0];
            if (declaration) {
                targetFile = declaration.getSourceFile().fileName;
            }
        }

        // 4. Save to the Collector
        collector.addCall({
            callerId,       // The ID of the function containing this line
            targetName,     // The name of the function being called
            targetFile,     // The file where that function lives
            line: getLine(node, sourceFile),
            isExternal: targetFile.includes('node_modules')
        });
    }
};
