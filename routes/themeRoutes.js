const express = require('express');
const router = express.Router();
const Theme = require('../models/Theme');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require(path.join(
  __dirname,
  '../config/serviceAccountKey.json'
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com', // update if your bucket is different
  });
}
const bucket = admin.storage().bucket();

// GET /api/theme - fetch the current theme
router.get('/api/theme', async (req, res) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      // Provide default theme if none exists
      theme = await Theme.create({
        siteTitle: "Logan's Run",
        primaryColor: '#e3ff05',
        secondaryColor: '#f08080',
        primaryFont: 'SprayPaint',
        secondaryFont: 'Courier New',
        paceTheme: 'center-atom',
      });
    } else {
      // Ensure paceTheme field exists (for existing documents)
      if (!theme.paceTheme) {
        theme.paceTheme = 'center-atom';
        await theme.save();
      }
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

// POST /api/updateTheme - update or create the theme
router.post('/api/updateTheme', async (req, res) => {
  try {
    const update = req.body;
    let theme = await Theme.findOne();
    const { bandLogoUrl, oldBandLogoUrl } = update;
    if (theme) {
      Object.assign(theme, update);
      await theme.save();
    } else {
      theme = await Theme.create(update);
    }
    // Delete old band logo from Firebase if needed
    if (oldBandLogoUrl && bandLogoUrl && oldBandLogoUrl !== bandLogoUrl) {
      const match = oldBandLogoUrl.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        await bucket
          .file(filePath)
          .delete()
          .catch(err => {
            console.error('Firebase delete error:', err);
          });
      } else {
        console.warn(
          'Could not extract Firebase file path from URL:',
          oldBandLogoUrl
        );
      }
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

module.exports = router;
