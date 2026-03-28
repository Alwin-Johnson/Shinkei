const traverse = require("@babel/traverse").default;

/**
 * functions.extractor.js
 */

function extract(context) {
    const results = [];
    const filePath = context.filePath || "unknown";

    function push(entry) {
        if (!entry.name) return;
        entry.id = `${filePath}::${entry.name}`;
        entry.file = filePath;
        results.push(entry);
    }

    traverse(context.ast, {
        // ─── function login() {} ───────────────────────────────────────────
        FunctionDeclaration(path) {
            const name = path.node.id?.name ?? `anonymous_${path.node.loc?.start.line}`;
            const isExported =
                path.parent.type === "ExportNamedDeclaration" ||
                path.parent.type === "ExportDefaultDeclaration";
            const isDefaultExport = path.parent.type === "ExportDefaultDeclaration";

            push({
                name,
                line: path.node.loc?.start.line,
                type: "declaration",
                isAsync: path.node.async ?? false,
                isExported,
                isDefaultExport,
            });
        },

        // ─── Arrow Functions & Assignment (exports.login = () => {}) ───────
        ArrowFunctionExpression(path) {
            let name = null;
            let isExported = false;

            // Case A: const login = () => {}
            if (path.parent.type === "VariableDeclarator") {
                name = path.parent.id?.name ?? null;
                if (path.parentPath.parentPath?.type === "ExportNamedDeclaration") isExported = true;
            }

            // Case B: exports.login = () => {}
            if (!name && path.parent.type === "AssignmentExpression") {
                const left = path.parent.left;
                if (left.type === "MemberExpression") {
                    name = left.property?.name ?? null;
                    isExported = true; 
                } else if (left.type === "Identifier") {
                    name = left.name;
                }
            }

            if (!name) name = `anonymous_${path.node.loc?.start.line}`;

            push({
                name,
                line: path.node.loc?.start.line,
                type: "arrow",
                isAsync: path.node.async ?? false,
                isExported,
                isDefaultExport: false,
            });
        },

        // ─── Function Expressions (obj.login = function() {}) ──────────────
        FunctionExpression(path) {
            let name = null;
            let type = "expression";
            let isExported = false;

            if (path.parent.type === "VariableDeclarator") {
                name = path.parent.id?.name ?? null;
            } else if (path.parent.type === "ObjectProperty") {
                name = path.parent.key?.name ?? path.parent.key?.value ?? null;
                type = "method";
            } else if (path.parent.type === "AssignmentExpression") {
                const left = path.parent.left;
                name = left.property?.name ?? (left.type === "Identifier" ? left.name : null);
                type = "method";
                isExported = true;
            }

            if (path.parent.type === "ExportDefaultDeclaration") {
                name = "defaultExport";
                isExported = true;
            }

            if (!name) name = `anonymous_${path.node.loc?.start.line}`;

            push({
                name,
                line: path.node.loc?.start.line,
                type,
                isAsync: path.node.async ?? false,
                isExported: isExported || path.parent.type === "ExportNamedDeclaration",
                isDefaultExport: path.parent.type === "ExportDefaultDeclaration",
            });
        },

        ClassMethod(path) {
            const name = path.node.key?.name ?? path.node.key?.value ?? null;
            if (!name) return;
            push({
                name,
                line: path.node.loc?.start.line,
                type: "classMethod",
                isAsync: path.node.async ?? false,
                isExported: false,
            });
        }
    });

    return results;
}

module.exports = { extract };
