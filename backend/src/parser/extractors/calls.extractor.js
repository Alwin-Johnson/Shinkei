const traverse = require("@babel/traverse").default;

/**
 * calls.extractor.js
 *
 * Detects ALL function calls in a JS/JSX/TS/TSX file.
 * Tracks WHO is calling WHOM — critical for flow building.
 */

// ─── helper: get current enclosing function name from path ───────────────────
function getCurrentFunction(path) {
    let current = path.parentPath;
    while (current) {
        const node = current.node;

        // 1. Standard Declaration: function myFunc() {}
        if (node.type === "FunctionDeclaration" && node.id?.name) {
            return node.id.name;
        }

        // 2. Arrow/Anonymous Functions attached to variables, exports, or objects
        if (node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
            const parent = current.parent;

            if (parent) {
                // Case A: const myFunc = () => {}
                if (parent.type === "VariableDeclarator" && parent.id?.name) {
                    return parent.id.name;
                }

                // Case B: exports.myFunc = () => {} OR module.exports.myFunc = () => {}
                if (parent.type === "AssignmentExpression") {
                    const left = parent.left;
                    if (left.type === "MemberExpression" && left.property?.name) {
                        return left.property.name; // returns "myFunc"
                    }
                    if (left.type === "Identifier" && left.name) {
                        return left.name;
                    }
                }

                // Case C: { myFunc: () => {} }
                if (parent.type === "ObjectProperty" && parent.key?.name) {
                    return parent.key.name;
                }
            }
        }

        // 3. Class Methods: class MyClass { myFunc() {} }
        if (node.type === "ClassMethod" && node.key?.name) {
            return node.key.name;
        }

        current = current.parentPath;
    }
    return "module"; // top-level call outside any function
}

function extract(context) {
    const results = [];
    const filePath = context.filePath || "unknown";

    // ─── helper: register a call safely ──────────────────────────────────────
    function addCall(name, object, from, type, line, argCount) {
        if (!name) return;

        // skip common noise that adds no flow value
        const NOISE = new Set([
            "log", "warn", "error", "info", "debug",
            "toString", "valueOf", "hasOwnProperty",
            "push", "pop", "shift", "unshift",
            "trim", "split", "replace", "includes"
        ]);
        if (NOISE.has(name) && object === "console") return;

        results.push({
            name,
            object,
            callee: object ? `${object}.${name}` : name,
            from,
            type,
            line,
            file: filePath,
            argumentCount: argCount,
        });
    }

    // ─── helper: scan arguments for passed functions (callbacks) ─────────────
    function extractCallbacksFromArgs(args, from) {
        args.forEach(arg => {
            // setTimeout(loginUser)
            if (arg.type === "Identifier") {
                addCall(arg.name, null, from, "callback", arg.loc?.start.line, 0);
            } 
            // arr.map(this.processUser)
            else if (arg.type === "MemberExpression") {
                const obj = arg.object?.type === "ThisExpression" ? "this" : arg.object?.name;
                const prop = arg.property?.name;
                if (prop) {
                    addCall(prop, obj, from, "callback", arg.loc?.start.line, 0);
                }
            } 
            // axios.post("/api", { onSuccess: handleLogin })
            else if (arg.type === "ObjectExpression") {
                arg.properties.forEach(p => {
                    if (p.value?.type === "Identifier") {
                        addCall(p.value.name, null, from, "callback", p.value.loc?.start.line, 0);
                    } else if (p.value?.type === "MemberExpression") {
                        const obj = p.value.object?.type === "ThisExpression" ? "this" : p.value.object?.name;
                        const prop = p.value.property?.name;
                        if (prop) {
                            addCall(prop, obj, from, "callback", p.value.loc?.start.line, 0);
                        }
                    }
                });
            }
        });
    }

    traverse(context.ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            let name   = null;
            let object = null;
            let type   = "unknown";

            // ── direct call: loginUser() ──────────────────────────────────
            if (callee.type === "Identifier") {
                name = callee.name;
                type = "direct";
            }

            // ── member call: auth.loginUser() ─────────────────────────────
            if (callee.type === "MemberExpression" && !callee.optional) {
                name   = callee.property?.name ?? null;
                object = callee.object?.name   ?? null;

                // this.loginUser()
                if (callee.object?.type === "ThisExpression") {
                    object = "this";
                }
                type = "member";
            }

            // ── optional chaining: api?.loginUser() ───────────────────────
            if (callee.type === "OptionalMemberExpression" ||
                (callee.type === "MemberExpression" && callee.optional)) {
                name   = callee.property?.name ?? null;
                object = callee.object?.name   ?? null;
                type   = "optionalMember";
            }

            const from = getCurrentFunction(path);

            // Register the main call
            addCall(name, object, from, type, path.node.loc?.start.line, path.node.arguments.length);
            
            // Scan its arguments for callbacks
            extractCallbacksFromArgs(path.node.arguments, from);
        },

        // ── new AuthService() ─────────────────────────────────────────────
        NewExpression(path) {
            const callee = path.node.callee;
            let name = null;
            let object = null;

            if (callee.type === "Identifier") {
                name = callee.name;
            } else if (callee.type === "MemberExpression") {
                name = callee.property?.name ?? null;
                object = callee.object?.name ?? null;
                if (callee.object?.type === "ThisExpression") {
                    object = "this";
                }
            }

            const from = getCurrentFunction(path);
            
            // Register the constructor call
            addCall(name, object, from, "constructor", path.node.loc?.start.line, path.node.arguments.length);
            
            // Scan its arguments for callbacks
            extractCallbacksFromArgs(path.node.arguments, from);
        }
    });

    return results;
}

module.exports = { extract };
