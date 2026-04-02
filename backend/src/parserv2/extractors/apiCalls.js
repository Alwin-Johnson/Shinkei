// parserv2/extractors/apiCalls.js
const ts = require('typescript');
const { getLine, getSafeName } = require('../utils/ast-helpers');
const { makeFunctionId } = require('../utils/ids');

module.exports = function extractApiRequests(node, context) {
    const { collector, sourceFile } = context;

    if (ts.isCallExpression(node)) {
        const exp = node.expression;
        let method = '';
        let url = 'unknown';

        // 1. Find the Enclosing Function (The Caller)
        let parent = node.parent;
        let callerNode = null;
        while (parent) {
            if (ts.isFunctionDeclaration(parent) || ts.isMethodDeclaration(parent) || ts.isArrowFunction(parent) || ts.isFunctionExpression(parent)) {
                callerNode = parent;
                break;
            }
            parent = parent.parent;
        }
        const callerId = callerNode ? makeFunctionId(sourceFile.fileName, getSafeName(callerNode), getLine(callerNode, sourceFile)) : "top-level";

        // Helper to clean URL strings and handle template literals
        const getCleanUrl = (arg) => {
            if (!arg) return 'unknown';
            // Handle `backtick` template literals by replacing variables with placeholders
            let text = arg.getText(sourceFile).replace(/['"`]/g, '');
            if (ts.isTemplateExpression(arg)) {
                // Convert "/api/user/${id}" to "/api/user/:id" for easier route matching
                return text.replace(/\${[^}]+}/g, ':param');
            }
            return text;
        };

        // ==========================================
        // SCENARIO 1: fetch(), axios(), api()
        // ==========================================
        if (ts.isIdentifier(exp)) {
            const name = exp.text;
            if (['fetch', 'axios', 'api'].includes(name)) {
                method = 'GET'; // Default for fetch
                url = getCleanUrl(node.arguments[0]);

                // Check for config objects: fetch(url, { method: 'POST' })
                if (node.arguments.length > 1 && ts.isObjectLiteralExpression(node.arguments[1])) {
                    node.arguments[1].properties.forEach(prop => {
                        if (ts.isPropertyAssignment(prop) && prop.name.getText(sourceFile) === 'method') {
                            method = prop.initializer.getText(sourceFile).replace(/['"`]/g, '').toUpperCase();
                        }
                    });
                }
            }
        }

        // ==========================================
        // SCENARIO 2: axios.post(), api.get(), etc.
        // ==========================================
        else if (ts.isPropertyAccessExpression(exp)) {
            const caller = exp.expression.getText(sourceFile).toLowerCase(); 
            const propertyName = exp.name.text.toLowerCase();

            const apiLibraries = ['axios', 'api', 'http', 'client'];
            const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];

            if (apiLibraries.includes(caller) && httpMethods.includes(propertyName)) {
                method = propertyName.toUpperCase();
                url = getCleanUrl(node.arguments[0]);
            }
        }

        // ─── FINAL VALIDATION & COLLECTION ───────────────────────────────────
        
        if (method && url !== 'unknown') {
            // Normalize URL: Strip domain if present (e.g., http://localhost:5000/api -> /api)
            const normalizedUrl = url.replace(/^https?:\/\/[^\/]+/, '');

            // Only log actual network-looking hits
            if (normalizedUrl.startsWith('/') || normalizedUrl.includes('api')) {
                collector.addApiCall({
                    callerId,
                    method,
                    url: normalizedUrl,
                    file: sourceFile.fileName, // CRITICAL for Spatial Matching
                    line: getLine(node, sourceFile),
                    fullExpression: node.getText(sourceFile).substring(0, 100)
                });
            }
        }
    }
};
