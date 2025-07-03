const express = require('express');
const router = express.Router();
const ShowsSettings = require('../models/ShowsSettings');

// GET /api/showsSettings - fetch the current shows settings
router.get('/api/showsSettings', async (req, res) => {
  try {
    let settings = await ShowsSettings.findOne();
    if (!settings) {
      settings = await ShowsSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shows settings' });
  }
});

// POST /api/updateShowsSettings - update or create the shows settings
router.post('/api/updateShowsSettings', async (req, res) => {
  try {
    const update = req.body;
    let settings = await ShowsSettings.findOne();
    if (settings) {
      Object.assign(settings, update);
      await settings.save();
    } else {
      settings = await ShowsSettings.create(update);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shows settings' });
  }
});

module.exports = router;
