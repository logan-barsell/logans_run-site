const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/api/theme', themeController.getTheme);

// Admin routes (require authentication)
router.post('/api/updateTheme', requireAuth, themeController.updateTheme);

module.exports = router;
