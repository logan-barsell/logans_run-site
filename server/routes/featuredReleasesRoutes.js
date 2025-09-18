const express = require('express');
const featuredReleaseController = require('../controllers/featuredReleaseController');
const { requireAuth } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all admin routes
router.use(adminLimiter);

// GET all featured releases (public, sorted by releaseDate desc)
router.get(
  '/api/featuredReleases',
  featuredReleaseController.getFeaturedReleases
);

// ADD a new featured release (admin only)
router.post(
  '/api/featuredReleases',
  requireAuth,
  featuredReleaseController.addFeaturedRelease
);

// UPDATE a featured release (admin only)
router.put(
  '/api/featuredReleases/:id',
  requireAuth,
  featuredReleaseController.updateFeaturedRelease
);

// DELETE a featured release (admin only)
router.delete(
  '/api/featuredReleases/:id',
  requireAuth,
  featuredReleaseController.deleteFeaturedRelease
);

module.exports = router;
