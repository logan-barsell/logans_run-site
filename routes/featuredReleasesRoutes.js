const express = require('express');
const router = express.Router();
const FeaturedRelease = require('../models/FeaturedRelease');
const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
}

// GET all featured releases (public, sorted by releaseDate desc)
router.get('/api/featuredReleases', async (req, res) => {
  try {
    const releases = await FeaturedRelease.find().sort({ releaseDate: -1 });
    res.status(200).json(releases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured releases' });
  }
});

// ADD a new featured release (admin only)
router.post('/api/featuredReleases', requireAuth, async (req, res) => {
  try {
    const release = new FeaturedRelease(req.body);
    await release.save();
    res.status(201).json(release);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add featured release' });
  }
});

// UPDATE a featured release (admin only)
router.put('/api/featuredReleases/:id', requireAuth, async (req, res) => {
  try {
    const updated = await FeaturedRelease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update featured release' });
  }
});

// DELETE a featured release (admin only)
router.delete('/api/featuredReleases/:id', requireAuth, async (req, res) => {
  try {
    await FeaturedRelease.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete featured release' });
  }
});

module.exports = router;
