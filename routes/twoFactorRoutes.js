const express = require('express');
const router = express.Router();
const twoFactorController = require('../controllers/twoFactorController');
const { requireAuth } = require('../middleware/auth');

// POST send 2FA code (no auth required - used during login process)
router.post('/send-code', twoFactorController.sendCode);

// All other 2FA routes require authentication
router.use(requireAuth);

// GET 2FA status
router.get('/status', twoFactorController.getTwoFactorStatus);

// POST enable 2FA
router.post('/enable', twoFactorController.enableTwoFactor);

// POST disable 2FA
router.post('/disable', twoFactorController.disableTwoFactor);

// POST verify 2FA code
router.post('/verify-code', twoFactorController.verifyCode);

module.exports = router;
