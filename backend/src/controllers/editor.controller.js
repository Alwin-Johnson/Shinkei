// backend/src/controllers/editor.controller.js
const editorService = require('../services/editorService');

exports.getCodeFile = async (req, res) => {
    try {
        const filePath = req.query.file;
        const requestedLine = Number.parseInt(req.query.line, 10);
        const line = Number.isFinite(requestedLine) && requestedLine > 0 ? requestedLine : null;

        if (!filePath) {
            return res.status(400).json({ success: false, error: "Missing file path" });
        }

        console.log(`📖 [Editor] Reading file: ${filePath.split('/').pop()}`);

                if (line !== null) {
          const { snippet, range, snippetStartLine } = await editorService.extractDesignSnippet(filePath, line);
          return res.json({ success: true, content: snippet, range, snippetStartLine });
        } else {
          const content = await editorService.readTargetFile(filePath);
          return res.json({ success: true, content: content });
        }

    } catch (error) {
        console.error("❌ [Editor] Read crash:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.saveCodeFile = async (req, res) => {
    try {
        const { filePath, newCode, repoRoot, range } = req.body;
        
        if (!filePath || !newCode || !repoRoot) {
            return res.status(400).json({ success: false, error: "Missing required payload (filePath, newCode, repoRoot)" });
        }

        console.log(`💾 [Editor] Saving changes to: ${filePath.split('/').pop()}`);
        await editorService.writeTargetFile(filePath, newCode, repoRoot, range);
        console.log(`✅ [Editor] Sync successful.`);

        return res.json({ success: true, message: "Code successfully synced to disk." });

    } catch (error) {
        console.error("❌ [Editor] Save crash:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};