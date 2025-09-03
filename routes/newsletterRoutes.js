const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { requireAuth } = require('../middleware/auth');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Rate limiting for newsletter endpoints
const newsletterSignupLimiter = createRateLimiter(60, 50); // 50 requests per hour for signup
const newsletterLimiter = createRateLimiter(60, 100); // 100 requests per hour for other newsletter operations

// Newsletter signup (public) - Rate limited
router.post(
  '/signup',
  newsletterSignupLimiter,
  newsletterController.newsletterSignup
);

// Unsubscribe endpoints (public) - Rate limited
router.get(
  '/unsubscribe',
  newsletterLimiter,
  newsletterController.verifyUnsubscribeToken
);
router.post(
  '/unsubscribe',
  newsletterLimiter,
  newsletterController.unsubscribe
);

// Admin endpoints (require authentication) - Rate limited
router.get(
  '/stats',
  requireAuth,
  newsletterLimiter,
  newsletterController.getNewsletterStats
);
router.get(
  '/subscribers',
  requireAuth,
  newsletterLimiter,
  newsletterController.getNewsletterSubscribers
);

module.exports = router;
