// parserv2/extractors/jsx-events.js
const ts = require('typescript');
const { getLine, getSafeName } = require('../utils/ast-helpers');
const { makeFunctionId } = require('../utils/ids');

module.exports = function extractJsxEvents(node, context) {
    const { collector, sourceFile } = context;

    // 1. Target JSX Attributes (e.g., onClick, onChange)
    if (ts.isJsxAttribute(node)) {
        
        // ==========================================
        // 2. Find the Enclosing Function (The Component)
        // ==========================================
        let parent = node.parent;
        let callerNode = null;

        while (parent) {
            if (ts.isFunctionDeclaration(parent) || 
                ts.isMethodDeclaration(parent) || 
                ts.isArrowFunction(parent) ||
                ts.isFunctionExpression(parent)) {
                callerNode = parent;
                break;
            }
            parent = parent.parent;
        }

        const callerId = callerNode 
            ? makeFunctionId(sourceFile.fileName, getSafeName(callerNode), getLine(callerNode, sourceFile))
            : "top-level";

        // ==========================================
        // 3. Extract Event & Element Details
        // ==========================================
        const attrName = node.name.getText(sourceFile);
        
        // Standard React convention: props starting with 'on'
        if (/^on[A-Z]/.test(attrName)) {
            // Get the handler name, stripping curly braces {}
            const handlerText = node.initializer 
                ? node.initializer.getText(sourceFile).replace(/[{}]/g, '').trim() 
                : "inline";

            // NAVIGATION: Node (Attribute) -> Parent (Attributes List) -> Parent (Opening Element)
            // This is how we get the "button" or "div" or "MyComponent" string
            let tagName = "unknown";
            const openingElement = node.parent.parent; 

            if (openingElement) {
                if (ts.isJsxOpeningElement(openingElement) || ts.isJsxSelfClosingElement(openingElement)) {
                    tagName = openingElement.tagName.getText(sourceFile);
                }
            }

            collector.addEvent({
                callerId,
                event: attrName,           // e.g., "onClick"
                element: tagName,          // e.g., "button"
                handler: handlerText,      // e.g., "handleSubmit"
                line: getLine(node, sourceFile),
                file: sourceFile.fileName,
                component: tagName         // Keeping 'component' for your stats builder
            });
        }
    }
};
