const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { requireAuth } = require('../middleware/auth');

// Newsletter signup (public)
router.post('/signup', newsletterController.newsletterSignup);

// Unsubscribe endpoints (public)
router.get('/unsubscribe', newsletterController.verifyUnsubscribeToken);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Admin endpoints (require authentication)
router.get('/stats', requireAuth, newsletterController.getNewsletterStats);
router.get(
  '/subscribers',
  requireAuth,
  newsletterController.getNewsletterSubscribers
);

module.exports = router;
