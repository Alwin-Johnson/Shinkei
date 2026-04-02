// parserv2/utils/ids.js

/**
 * Consistent ID generation across all extractors in ParserV2.
 * This ensures a function found in functions.js has the same 
 * signature as the callerId found in calls.js.
 */
exports.makeFunctionId = (filePath, name, line) => {
    // We use forward slashes and a clean string for the ID
    const cleanPath = filePath.replace(/\\/g, '/');
    return `${cleanPath}::${name}::${line || '?'}`;
};
