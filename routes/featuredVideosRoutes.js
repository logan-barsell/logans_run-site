const express = require('express');
const featuredVideoController = require('../controllers/featuredVideoController');
const { requireAuth } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all admin routes
router.use(adminLimiter);

// GET all featured videos (public, sorted by releaseDate desc)
router.get('/api/featuredVideos', featuredVideoController.getFeaturedVideos);

// ADD a new featured video (admin only)
router.post(
  '/api/featuredVideos',
  requireAuth,
  featuredVideoController.addFeaturedVideo
);

// UPDATE a featured video (admin only)
router.put(
  '/api/featuredVideos/:id',
  requireAuth,
  featuredVideoController.updateFeaturedVideo
);

// DELETE a featured video (admin only)
router.delete(
  '/api/featuredVideos/:id',
  requireAuth,
  featuredVideoController.deleteFeaturedVideo
);

module.exports = router;
