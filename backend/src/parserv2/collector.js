// parserv2/collector.js
class Collector {
    constructor(filePath) {
        // Normalizing the path helps when matching frontend calls to backend routes later
        this.filePath = filePath; 
        this.data = {
            functions: [],
            calls: [],
            imports: [],
            routes: [],   // Backend: app.get('/api/data', handler)
            apiCalls: [], // Frontend: fetch('/api/data')
            events: [] ,   // Frontend: onClick={handleClick}
            mounts: []
        };
    }

    addFunction(func) { 
        this.data.functions.push({ ...func, file: this.filePath }); 
    }

    addCall(call) { 
        this.data.calls.push({ ...call, file: this.filePath }); 
    }

    addImport(imp) { 
        this.data.imports.push({ ...imp, file: this.filePath }); 
    }

    addRoute(route) { 
        this.data.routes.push({ ...route, file: this.filePath }); 
    }

    addApiCall(api) {
        this.data.apiCalls.push({ ...api, file: this.filePath });
    }

    addEvent(event) {
        this.data.events.push({ ...event, file: this.filePath });
    }
    
    addMount(mount) {
        this.data.mounts.push({ ...mount, file: this.filePath });

    }

    getData() { 
        return this.data; 
    }
}


module.exports = { Collector };
