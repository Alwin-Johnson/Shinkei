const ts = require('typescript');
const { getLine } = require('../utils/ast-helpers');

module.exports = function extractImports(node, context) {
    const { collector, sourceFile, typeChecker } = context;

    // 1. Handle ESM: 'import { x } from "y"'
    if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, '');
        const symbol = typeChecker.getSymbolAtLocation(node.moduleSpecifier);
        const resolvedPath = symbol?.valueDeclaration?.getSourceFile().fileName || moduleSpecifier;

        // Try to get the local name (e.g., analyzeRoutes)
        const localName = node.importClause?.name?.getText(sourceFile) || 
                          node.importClause?.namedBindings?.getText(sourceFile);

        collector.addImport({
            localName: localName,
            module: moduleSpecifier,
            resolvedPath: resolvedPath,
            line: getLine(node, sourceFile),
            isExternal: !moduleSpecifier.startsWith('.')
        });
    }

    // 2. Handle CommonJS: 'const analyzeRoutes = require("./routes/analyze.routes")'
    if (ts.isVariableDeclaration(node)) {
        if (node.initializer && ts.isCallExpression(node.initializer)) {
            const call = node.initializer;
            
            // Is the function being called named 'require'?
            if (ts.isIdentifier(call.expression) && call.expression.text === 'require') {
                const arg = call.arguments[0];
                
                if (arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))) {
                    const moduleSpecifier = arg.text;
                    const localName = node.name.getText(sourceFile); // e.g., 'analyzeRoutes'
                    
                    // Note: resolvedPath for require is harder without full node resolution, 
                    // so we pass the module string and let IndexBuilder handle the match.
                    collector.addImport({
                        localName: localName,
                        module: moduleSpecifier,
                        resolvedPath: moduleSpecifier, 
                        line: getLine(node, sourceFile),
                        isExternal: !moduleSpecifier.startsWith('.')
                    });
                }
            }
        }
    }
};
