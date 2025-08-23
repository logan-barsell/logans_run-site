const express = require('express');
const router = express.Router();
const FeaturedVideo = require('../models/FeaturedVideo');
const { requireAuth } = require('../middleware/auth');

// GET all featured videos (public, sorted by releaseDate desc)
router.get('/api/featuredVideos', async (req, res) => {
  try {
    const videos = await FeaturedVideo.find().sort({ releaseDate: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured videos' });
  }
});

// ADD a new featured video (admin only)
router.post('/api/featuredVideos', requireAuth, async (req, res) => {
  try {
    if (!req.body.releaseDate) {
      return res.status(400).json({ error: 'releaseDate is required' });
    }
    const video = new FeaturedVideo(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add featured video' });
  }
});

// UPDATE a featured video (admin only)
router.put('/api/featuredVideos/:id', requireAuth, async (req, res) => {
  try {
    if (!req.body.releaseDate) {
      return res.status(400).json({ error: 'releaseDate is required' });
    }
    const updated = await FeaturedVideo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update featured video' });
  }
});

// DELETE a featured video (admin only)
router.delete('/api/featuredVideos/:id', requireAuth, async (req, res) => {
  try {
    await FeaturedVideo.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete featured video' });
  }
});

module.exports = router;
