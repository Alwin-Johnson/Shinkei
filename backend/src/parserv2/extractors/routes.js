const ts = require('typescript');
const { getLine } = require('../utils/ast-helpers');
const path = require('path');

module.exports = function extractRoutes(node, context) {
    const { collector, sourceFile } = context;

    if (!ts.isCallExpression(node)) return;

    const exp = node.expression;
    if (!ts.isPropertyAccessExpression(exp)) return;

    const method = exp.name.text.toLowerCase();

// HANDLE MOUNTS
if (method === 'use') {
    const args = node.arguments;

    if (
        args.length >= 2 &&
        (ts.isStringLiteral(args[0]) || ts.isNoSubstitutionTemplateLiteral(args[0]))
    ) {
        const basePath = args[0].text;

        let routerName = "unknown";

        const routerArg = args[1];

        // router variable
        if (ts.isIdentifier(routerArg)) {
            routerName = routerArg.text;
        }

        // require('./routes/xyz')
        else if (ts.isCallExpression(routerArg)) {
            if (
                ts.isIdentifier(routerArg.expression) &&
                routerArg.expression.text === 'require'
            ) {
                const firstArg = routerArg.arguments[0];
                if (ts.isStringLiteral(firstArg)) {
                    routerName = firstArg.text; // path instead
                }
            }
        }

        // router.something
        else if (ts.isPropertyAccessExpression(routerArg)) {
            routerName = routerArg.name.text;
        }

        console.log("🔥 MOUNT FOUND:", basePath, routerName); // DEBUG

        collector.addMount({
            basePath,
            routerName,
            file: sourceFile.fileName,
            line: getLine(node, sourceFile)
        });
    }

    return;
}



    // ✅ NORMAL ROUTES
    const routeMethods = ['get', 'post', 'put', 'delete', 'patch'];

    if (!routeMethods.includes(method)) return;

    const args = node.arguments;

    if (
        args.length >= 2 &&
        (ts.isStringLiteral(args[0]) || ts.isNoSubstitutionTemplateLiteral(args[0]))
    ) {
        const routePath = args[0].text;
        const fileBase = path.basename(sourceFile.fileName).split('.')[0];

        const handlerNode = args[args.length - 1];
        let handlerName = "anonymous";

        if (ts.isIdentifier(handlerNode)) {
            handlerName = handlerNode.text;
        } else if (ts.isPropertyAccessExpression(handlerNode)) {
            handlerName = handlerNode.name.text;
        }

        collector.addRoute({
            method: method.toUpperCase(),
            path: routePath,
            pathHint: `/${fileBase}${routePath === '/' ? '' : routePath}`,
            file: sourceFile.fileName,
            line: getLine(node, sourceFile),
            handler: handlerName
        });
    }
};
