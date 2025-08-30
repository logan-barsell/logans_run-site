const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { requireAuth } = require('../middleware/auth');

// Public routes (used by public site)
router.get('/getVideos', mediaController.getVideos);
router.get('/getMediaImages', mediaController.getMediaImages);

// Admin routes (require authentication)
router.post('/updateVideo', requireAuth, mediaController.updateVideo);
router.get('/deleteVideo/:id', requireAuth, mediaController.deleteVideo);
router.post('/addVideo', requireAuth, mediaController.addVideo);
router.get(
  '/removeMediaImage/:id',
  requireAuth,
  mediaController.removeMediaImage
);
router.post('/addMediaImage', requireAuth, mediaController.addMediaImage);

module.exports = router;
