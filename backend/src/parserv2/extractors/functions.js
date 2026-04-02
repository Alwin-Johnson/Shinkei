const ts = require('typescript');
const { getLine, isExported } = require('../utils/ast-helpers');

module.exports = function extractFunctions(node, context) {
    const { collector, sourceFile } = context;

    let functionName = null;
    let targetNode = node;

    // 1. Pattern: function analyzeRepo() {}
    if (ts.isFunctionDeclaration(node) && node.name) {
        functionName = node.name.text;
    } 
    
    // 2. Pattern: classMethod() {}
    else if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
        functionName = node.name.text;
    }

    // 3. Pattern: const analyzeRepo = (req, res) => {}
    else if (ts.isVariableDeclaration(node) && node.initializer && 
            (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
        if (ts.isIdentifier(node.name)) {
            functionName = node.name.text;
            targetNode = node.initializer;
        }
    }

    // 4. Pattern: exports.analyzeRepo = (req, res) => {}
    else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
        const { left, right } = node;
        if ((ts.isArrowFunction(right) || ts.isFunctionExpression(right)) && ts.isPropertyAccessExpression(left)) {
            const objText = left.expression.getText();
            if (objText === 'exports' || objText === 'module.exports') {
                functionName = left.name.text;
                targetNode = right;
            }
        }
    }

    // --- NOISE FILTERS ---

    if (!functionName) return;

    // Filter out immediate callbacks (e.g., inside .map() or .filter())
    if (node.parent && (ts.isCallExpression(node.parent) || ts.isNewExpression(node.parent))) {
        return;
    }

    const exported = isExported(node) || !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export);
    
    // COMPLEXITY GUARD: Identify "Trivial" functions
    let isTrivial = false;
    const body = targetNode.body;

    // Case A: Arrow function one-liner without braces: k => k.id
    if (ts.isArrowFunction(targetNode) && body && !ts.isBlock(body)) {
        if (targetNode.getText().length < 65) isTrivial = true;
    }

    // Case B: Function with a block that is empty or just has one statement
    if (body && ts.isBlock(body)) {
        if (body.statements.length <= 1 && targetNode.getText().length < 50) {
            isTrivial = true;
        }
    }

    // Rule: Skip trivial functions UNLESS they are exported (part of the public API)
    if (isTrivial && !exported) {
        return;
    }

    // --- FINAL EXTRACTION ---
    collector.addFunction({
        name: functionName,
        startLine: getLine(targetNode, sourceFile),
        endLine: sourceFile.getLineAndCharacterOfPosition(targetNode.getEnd()).line + 1,
        isAsync: !!(ts.getCombinedModifierFlags(targetNode) & ts.ModifierFlags.Async),
        isExported: exported
    });
};
