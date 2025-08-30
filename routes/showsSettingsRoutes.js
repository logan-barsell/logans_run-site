const express = require('express');
const router = express.Router();
const showsSettingsController = require('../controllers/showsSettingsController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/api/showsSettings', showsSettingsController.getShowsSettings);

// Admin routes (require authentication)
router.post(
  '/api/updateShowsSettings',
  requireAuth,
  showsSettingsController.updateShowsSettings
);

module.exports = router;
