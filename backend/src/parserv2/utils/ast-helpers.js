const ts = require('typescript');

exports.getLine = (node, sourceFile) => {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
};

// src/parserv2/utils/ast-helpers.js
exports.getSafeName = (node) => {
    // 1. If it's a named function: function myName() {}
    if (node.name && ts.isIdentifier(node.name)) {
        return node.name.text;
    }

    // 2. If it's assigned to a variable: const myName = () => {}
    if (node.parent && ts.isVariableDeclaration(node.parent)) {
        if (ts.isIdentifier(node.parent.name)) {
            return node.parent.name.text;
        }
    }

    // 3. Fallback to the position-based name
    return `anonymous_L${node.getStart()}`;
};
exports.isExported = (node) => {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    return modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) || false;
};
