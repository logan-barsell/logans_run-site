const express = require('express');
const router = express.Router();
const {
  getSecurityPreferences,
  updateSecurityPreferences,
} = require('../controllers/securityPreferencesController');
const { requireAuth } = require('../middleware/auth');

// All routes require authentication
router.use(requireAuth);

// GET /api/security-preferences - Get user's security preferences
router.get('/', getSecurityPreferences);

// PUT /api/security-preferences - Update user's security preferences
router.put('/', updateSecurityPreferences);

module.exports = router;
