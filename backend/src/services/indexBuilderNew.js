const path = require("path");
const { analyze } = require("../parserv2/index"); 
const { makeFunctionId } = require("../parserv2/utils/ids");

function makeRouteId(method, routePath) {
    return `${(method ?? "ANY").toUpperCase()}::${routePath}`;
}

function makeEventId(file, eventName, element, line) {
    return `${file}::${line}::${eventName}::${element}`;
}

class IndexBuilder {
    constructor() {
        this.repoPath = null;

        this.functionsById = new Map();
        this.functionsByName = new Map();
        this.routes = new Map();
        this.events = new Map();
        this.files = new Map();
        this.apiCalls = [];
        this.callsTo = new Map();

        // ✅ NEW
        this.mounts = [];
        this.routerToFile = new Map();

        this._reverseMapInvalidated = false;
    }

// indexBuilderNew.js
async build(repoPath) {
    this.repoPath = repoPath;
    this._reset();

    // 'analyze' is the function from your engine.js
    const projectData = await analyze(repoPath); 

    // Now index the raw results into the Maps (this.functionsById, etc)
    for (const [absolutePath, fileData] of Object.entries(projectData)) {
        const relativePath = this._toRelative(absolutePath, repoPath);
        this.files.set(relativePath, fileData);

        this._indexFunctions(relativePath, fileData.functions || []);
        this._indexRoutes(relativePath, fileData.routes || []);
        this._indexCalls(relativePath, fileData.calls || []);
        this._indexApiCalls(relativePath, fileData.apiCalls || []);
        this._indexEvents(relativePath, fileData.events || []);

        if (fileData.mounts) {
            this.mounts.push(...fileData.mounts.map(m => ({ ...m, file: relativePath })));
        }
    }
    
    this._buildRouterMap();
    this._buildFullRoutes();

    return this; // 🔥 CRITICAL: Return the instance itself
}

    // ─────────────────────────────────────────────
    // ✅ NEW: router → file mapping
    // ─────────────────────────────────────────────
_buildRouterMap() {
    this.routerToFile.clear();
    for (const [file, data] of this.files.entries()) {
        const imports = data.imports || [];
        for (const imp of imports) {
            if (imp.localName && imp.module) {
                // Just store the module name (e.g., './routes/analyze.routes')
                this.routerToFile.set(imp.localName, imp.module);
            }
        }
    }
    console.log("📖 ROUTER PHONEBOOK:", Array.from(this.routerToFile.entries()));
}

_buildFullRoutes() {
    const finalRoutes = new Map();
    const stitchedIds = new Set();

    console.log("\n--- 🧵 STITCHING DEBUG ---");
    console.log(`Mounts to process: ${this.mounts.length}`);
    console.log(`Routes to check: ${this.routes.size}`);

    for (const mount of this.mounts) {
        const importSource = this.routerToFile.get(mount.routerName);
        if (!importSource) {
            console.log(`⚠️  Missing Phonebook entry for: ${mount.routerName}`);
            continue;
        }

        // The "Nuclear" Cleaner: 
        // './routes/analyze.routes' -> 'analyze'
        // 'backend/src/routes/analyze.routes.js' -> 'analyze'
        const clean = (p) => p.split('/').pop().split('.')[0].replace('.routes', '').toLowerCase();
        
        const target = clean(importSource);

        for (const [id, route] of this.routes.entries()) {
            const current = clean(route.file);

            // Log every attempt so we can see the strings
            console.log(`  Comparing: [${target}] (from mount) vs [${current}] (from ${route.file})`);

            if (target === current && target !== '') {
                const fullPath = this._joinPaths(mount.basePath, route.path);
                const newId = `${route.method.toUpperCase()}::${fullPath}`;

                console.log(`🚀 SUCCESS! STITCHED: ${id} -> ${newId}`);

                finalRoutes.set(newId, {
                    ...route,
                    path: fullPath,
                    id: newId
                });
                stitchedIds.add(id);
            }
        }
    }

    // Keep everything else
    for (const [id, route] of this.routes.entries()) {
        if (!stitchedIds.has(id)) {
            finalRoutes.set(id, route);
        }
    }
    this.routes = finalRoutes;
}
    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────
_joinPaths(base, sub) {
    // Remove trailing slash from base
    const cleanBase = base.replace(/\/$/, '');
    // Remove leading slash from sub
    const cleanSub = sub.replace(/^\//, '');
    
    // If sub was just '/', cleanSub is now empty. 
    // We don't want a trailing slash unless the final path is literally just "/"
    const joined = cleanSub ? `${cleanBase}/${cleanSub}` : cleanBase;
    
    return joined === '' ? '/' : joined;
}
    _indexApiCalls(relativePath, apiCalls) {
        for (const api of apiCalls) {
            const normalizedUrl = api.url.replace(/^https?:\/\/[^\/]+/, '');
            this.apiCalls.push({
                ...api,
                url: normalizedUrl,
                rawUrl: api.url,
                file: relativePath
            });
        }
    }

    _indexEvents(relativePath, events) {
        for (const ev of events) {
            const id = makeEventId(relativePath, ev.event, ev.element, ev.line);

            if (!this.events.has(id)) {
                this.events.set(id, {
                    ...ev,
                    id,
                    file: relativePath
                });
            }
        }
    }

    _indexFunctions(relativePath, functions) {
        for (const fn of functions) {
            const id = makeFunctionId(relativePath, fn.name, fn.startLine);

            this.functionsById.set(id, {
                id,
                ...fn,
                file: relativePath
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

            if (!this.routes.has(id)) {
                this.routes.set(id, {
                    id,
                    ...route,
                    file: relativePath
                });
            }
        }
    }

    _indexCalls(relativePath, calls) {
        for (const call of calls) {
            const targetFile = call.resolvedTargetFile || "unknown";

            if (!this.callsTo.has(targetFile)) {
                this.callsTo.set(targetFile, []);
            }

            this.callsTo.get(targetFile).push({
                ...call,
                callerFile: relativePath
            });
        }
    }

    _reset() {
        this.functionsById.clear();
        this.functionsByName.clear();
        this.routes.clear();
        this.events.clear();
        this.files.clear();
        this.callsTo.clear();
        this.apiCalls = [];

        // ✅ reset new structures
        this.mounts = [];
        this.routerToFile.clear();

        this._reverseMapInvalidated = true;
    }

    _toRelative(absolutePath, repoPath) {
        return path.relative(repoPath, absolutePath).split(path.sep).join("/");
    }
}

const index = new IndexBuilder();
module.exports = { IndexBuilder, makeFunctionId, makeRouteId };
