// Remove the global require!

class ResolverAdapter {
    constructor(index) {
        // Tie this resolver strictly to the specific project being analyzed
        this.index = index; 
    }

    findFunction(nameOrId, fileHint = null) {
        if (this.index.functionsById.has(nameOrId)) return this.index.functionsById.get(nameOrId);
        
        const matchingIds = this.index.functionsByName.get(nameOrId);
        if (!matchingIds || matchingIds.length === 0) return null;
        
        if (fileHint) {
            const exactMatch = matchingIds.find(id => id.startsWith(fileHint));
            if (exactMatch) return this.index.functionsById.get(exactMatch);
        }
        return this.index.functionsById.get(matchingIds[0]);
    }

    findRoute(path, method) {
        const targetMethod = method.toUpperCase().trim();
        const targetPath = path.trim();
        const id = `${targetMethod}::${targetPath}`;

        // 🔥 OPTIMIZATION: Instant lookup instead of looping over all routes
        const routeMatch = this.index.routes.get(id);

        if (!routeMatch) return null;

        if (routeMatch.handler) {
            console.log(`🔗 Route found! Linking to handler: ${routeMatch.handler}`);
            
            // Find the handler function in the specific index
            const handlerFunc = this.findFunction(routeMatch.handler);
            
            if (handlerFunc) {
                return {
                    ...routeMatch,         
                    file: handlerFunc.file, 
                    startLine: handlerFunc.startLine,
                    handlerFunc: handlerFunc,
                    isHandler: true        
                };
            }
        }

        return routeMatch;
    }
}

// Export the class, not an instance
module.exports = { ResolverAdapter };
