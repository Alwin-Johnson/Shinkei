// backend/controllers/editor.controller.js
const editorService = require('../services/editorService');

exports.getCodeFile = async (req, res) => {
    try {
        const filePath = req.query.file;

        if (!filePath) {
            return res.status(400).json({ success: false, error: "Missing file path" });
        }

        const content = await editorService.readTargetFile(filePath);
        return res.json({ success: true, content: content });

    } catch (error) {
        console.error("[editor] read crash:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.saveCodeFile = async (req, res) => {
    try {
        const { filePath, newCode, repoRoot } = req.body;
        
        if (!filePath || !newCode || !repoRoot) {
            return res.status(400).json({ success: false, error: "Missing required payload" });
        }

        await editorService.writeTargetFile(filePath, newCode, repoRoot);

        return res.json({ success: true, message: "Code successfully synced to disk." });

    } catch (error) {
        console.error("[editor] save crash:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};