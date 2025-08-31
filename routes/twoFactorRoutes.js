const express = require('express');
const router = express.Router();
const {
  sendCode,
  verifyCode,
  enableTwoFactor,
  disableTwoFactor,
  getTwoFactorStatus,
} = require('../controllers/twoFactorController');
const { requireAuth } = require('../middleware/auth');

// All 2FA routes require authentication
router.use(requireAuth);

// GET 2FA status
router.get('/status', getTwoFactorStatus);

// POST enable 2FA
router.post('/enable', enableTwoFactor);

// POST disable 2FA
router.post('/disable', disableTwoFactor);

// POST send 2FA code
router.post('/send-code', sendCode);

// POST verify 2FA code
router.post('/verify-code', verifyCode);

module.exports = router;
