const path = require("path");
const { fileWalker: getAllFiles } = require("../utils/fileWalker");
const { runParser }               = require("../parser/engine/parserEngine");

// ─── Canonical ID builders ──────────────────────────────────────────────────

function makeFunctionId(file, name, startLine) {
    return `${file}::${name}::${startLine ?? "?"}`;
}

function makeRouteId(method, routePath) {
    return `${(method ?? "ANY").toUpperCase()}::${routePath}`;
}

/**
 * NEW: Events need to be unique per file and line to avoid "Duplicate" skips.
 */
function makeEventId(file, event, element, line) {
    return `${file}::${line}::${event}::${element}`;
}

// ─── IndexBuilder ─────────────────────────────────────────────────────────────

class IndexBuilder {
    constructor() {
        this.repoPath = null;

        this.functionsById = new Map();
        this.functionsByName = new Map();
        this.routes = new Map();
        this.events = new Map();
        this.files = new Map();
        
        // NEW: Storage for outbound API calls
        this.apiCalls = []; 

        this._reverseMapInvalidated = false;
    }

    async build(repoPath) {
        this.repoPath = repoPath;
        this._reset();

        try { require("./code_service").clearCache(); } catch (_) { }

        for (const absolutePath of getAllFiles(repoPath)) {
            const relativePath = this._toRelative(absolutePath, repoPath);
            
            const data = await runParser(absolutePath);
            if (!data) continue;

            this.files.set(relativePath, data);
            
            this._indexFunctions(relativePath, data.functions ?? []);
            this._indexRoutes(relativePath, data.routes ?? []);
            this._indexEvents(relativePath, data.events ?? []);
            
            // NEW: Added API Call indexing
            this._indexApiCalls(relativePath, data.apiCalls ?? []);
        }

        console.log(
            `[indexBuilder] built` +
            ` | files: ${this.files.size}` +
            ` | functions: ${this.functionsById.size}` +
            ` | routes: ${this.routes.size}` +
            ` | apiCalls: ${this.apiCalls.length}` + // Added to log
            ` | events: ${this.events.size}`
        );
    }

    _reset() {
        this.functionsById.clear();
        this.functionsByName.clear();
        this.routes.clear();
        this.events.clear();
        this.files.clear();
        this.apiCalls = []; // Reset API calls list
        this._invalidateReverseMap();
    }

    _invalidateReverseMap() {
        this._reverseMapInvalidated = true;
    }

    _toRelative(absolutePath, repoPath) {
        return path.relative(repoPath, absolutePath).split(path.sep).join("/");
    }

    _indexFunctions(relativePath, functions) {
        for (const fn of functions) {
            const startLine = fn.startLine ?? fn.line ?? null;
            const id = fn.id ?? makeFunctionId(relativePath, fn.name, startLine);

            this.functionsById.set(id, {
                id,
                name: fn.name,
                file: relativePath,
                startLine,
                endLine: fn.endLine ?? null,
                type: fn.type ?? "function",
            });

            if (!this.functionsByName.has(fn.name)) {
                this.functionsByName.set(fn.name, []);
            }
            this.functionsByName.get(fn.name).push(id);
        }
    }

    _indexRoutes(relativePath, routes) {
        for (const route of routes) {
            const id = makeRouteId(route.method, route.path);

            if (this.routes.has(id)) {
                // We keep the log for routes because duplicate routes in a backend ARE an error.
                console.warn(`[indexBuilder] duplicate route ${id} in ${relativePath} — skipped`);
                continue;
            }

            this.routes.set(id, {
                id,
                handler: route.handler,
                file: relativePath,
                method: (route.method ?? "ANY").toUpperCase(),
                path: route.path,
                line: route.line
            });
        }
    }

    /**
     * FIXED: We now include relativePath and line in the ID.
     */
    _indexEvents(relativePath, events) {
        for (const ev of events) {
            const id = makeEventId(relativePath, ev.event, ev.element, ev.line);

            if (this.events.has(id)) continue; 

            this.events.set(id, {
                id,
                handler: ev.handlerFunctionId,
                file: relativePath,
                event: ev.event,
                element: ev.element,
                line: ev.line,
                component: ev.component
            });
        }
    }

    /**
     * NEW: Index API calls for frontend-to-backend mapping.
     */
    _indexApiCalls(relativePath, apiCalls) {
        for (const api of apiCalls) {
            // Normalize URL: strip 'http://localhost:5000' so it matches the backend routes
            const normalizedUrl = api.url.replace(/^https?:\/\/[^\/]+/, '');

            this.apiCalls.push({
                ...api,
                url: normalizedUrl,
                rawUrl: api.url,
                file: relativePath
            });
        }
    }
}

const instance = new IndexBuilder();
module.exports = { index: instance, makeFunctionId, makeRouteId };
