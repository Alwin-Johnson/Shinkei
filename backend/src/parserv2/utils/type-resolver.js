const ts = require('typescript');

/**
 * Gets the actual source file location of a variable or function name.
 * High-level wrapper for symbol resolution.
 */
exports.resolveDefinition = (node, typeChecker) => {
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol) return null;

    // If it's an alias (like an import), follow it to the original source
    const actualSymbol = (symbol.flags & ts.SymbolFlags.Alias) 
        ? typeChecker.getAliasedSymbol(symbol) 
        : symbol;

    const declaration = actualSymbol.valueDeclaration || actualSymbol.declarations?.[0];
    if (!declaration) return null;

    return {
        fileName: declaration.getSourceFile().fileName,
        line: declaration.getSourceFile().getLineAndCharacterOfPosition(declaration.getStart()).line + 1,
        name: actualSymbol.name
    };
};

/**
 * Checks if a type is a Promise (useful for async flow visualization)
 */
exports.isAsyncType = (node, typeChecker) => {
    const type = typeChecker.getTypeAtLocation(node);
    const typeString = typeChecker.typeToString(type);
    return typeString.startsWith('Promise<') || typeString === 'Promise';
};
