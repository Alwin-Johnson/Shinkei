const traverse = require("@babel/traverse").default;

/**
 * routes.extractor.js
 */

const HTTP_VERBS = new Set(["get", "post", "put", "patch", "delete", "all", "use"]);

function collectRouterNames(ast) {
    const names = new Set(["app", "router", "server"]);
    traverse(ast, {
        VariableDeclarator(path) {
            const init = path.node.init;
            if (!init) return;
            if (init.type === "CallExpression" && init.callee?.property?.name === "Router") {
                const name = path.node.id?.name;
                if (name) names.add(name);
            }
        },
    });
    return names;
}

function resolveRoutePath(node) {
    if (!node) return null;
    if (node.type === "StringLiteral") return node.value;
    if (node.type === "TemplateLiteral") {
        return `dynamic:${node.quasis.map(q => q.value.raw).join(":param")}`;
    }
    return node.type === "Identifier" ? `dynamic:${node.name}` : null;
}

// ─── THE FIX: Support MemberExpressions (controller.method) ────────────────
function resolveHandlers(args) {
    const rest = args.slice(1);
    const middleware = [];
    let handler = null;

    rest.forEach((arg, i) => {
        const isLast = i === rest.length - 1;
        let resolvedName = null;

        // router.get('/', controller.deepScan)
        if (arg.type === "MemberExpression") {
            resolvedName = arg.property?.name ?? null;
        } 
        // router.get('/', deepScan)
        else if (arg.type === "Identifier") {
            resolvedName = arg.name;
        }
        // router.get('/', (req, res) => {})
        else if (arg.type === "ArrowFunctionExpression" || arg.type === "FunctionExpression") {
            resolvedName = "inline";
        }

        if (resolvedName) {
            if (isLast) handler = resolvedName;
            else middleware.push(resolvedName);
        }

        // handle array of middleware
        if (arg.type === "ArrayExpression") {
            arg.elements.forEach(el => {
                if (el?.type === "Identifier") middleware.push(el.name);
                else if (el?.type === "MemberExpression") middleware.push(el.property?.name);
            });
        }
    });

    return { handler, middleware };
}

function extract(context) {
    const results = [];
    const filePath = context.filePath || "unknown";
    const routerNames = collectRouterNames(context.ast);

    const isNextApiRoute = filePath.includes("/api/") && (filePath.endsWith(".js") || filePath.endsWith(".jsx"));

    traverse(context.ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (callee.type !== "MemberExpression") return;

            const object = callee.object?.name ?? null;
            const method = callee.property?.name ?? null;

            if (!method || !HTTP_VERBS.has(method)) return;
            if (!object || !routerNames.has(object)) return;

            const args = path.node.arguments;
            if (!args.length) return;

            const routePath = resolveRoutePath(args[0]);
            if (!routePath) return;

            const { handler, middleware } = resolveHandlers(args);

            results.push({
                method: method.toUpperCase(),
                path: routePath,
                router: object,
                handler,
                middleware,
                isDynamic: routePath.startsWith("dynamic:") || routePath.includes(":"),
                isUse: method === "use",
                line: path.node.loc?.start.line,
                file: filePath,
            });
        }
        // ... Next.js logic remains the same ...
    });

    return results;
}

module.exports = { extract };
