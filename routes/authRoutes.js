const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const {
  loginLimiter,
  resetPassLimiter,
  forgotPassLimiter,
} = require('../middleware/rateLimiter');

// Apply rate limiting to auth routes
router.use('/login', loginLimiter);
router.use('/forgot-password', forgotPassLimiter);
router.use('/reset-password', resetPassLimiter);

// Authentication endpoints
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', requireAuth, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', requireAuth, authController.checkAuth);

// Email verification
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendEmailVerification);

// Password reset
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// User initialization endpoint
router.post('/initialize', authController.initializeDefaultUser);

// Legacy endpoints for backward compatibility
router.post('/legacy/login', authController.login);
router.get('/legacy/me', requireAuth, authController.checkAuth);
router.post('/legacy/logout', requireAuth, authController.logout);

module.exports = router;
