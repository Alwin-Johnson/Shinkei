// backend/routes/editor.routes.js
const express = require('express');
const router = express.Router();
const editorController = require('../controllers/editor.controller');

// GET /api/editor/read?file=/src/App.jsx
router.get('/read', editorController.getCodeFile);

// POST /api/editor/save
router.post('/save', editorController.saveCodeFile);

module.exports = router;