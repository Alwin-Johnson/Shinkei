// backend/services/editor.service.js
const fs = require('fs-extra');
const path = require('path');

exports.readTargetFile = async (filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        return content;
    } catch (error) {
        throw new Error(`Could not read file at ${filePath}`);
    }
};

exports.writeTargetFile = async (filePath, newContent, repoRoot) => {
    // SECURITY CHECK: Prevent Directory Traversal hacks
    const absolutePath = path.resolve(filePath);
    const absoluteRepoRoot = path.resolve(repoRoot);

    if (!absolutePath.startsWith(absoluteRepoRoot)) {
        throw new Error("Security Violation: Attempted to write outside the target repository.");
    }

    try {
        await fs.writeFile(absolutePath, newContent, 'utf8');
        return true;
    } catch (error) {
        throw new Error(`Could not save file to ${filePath}`);
    }
};