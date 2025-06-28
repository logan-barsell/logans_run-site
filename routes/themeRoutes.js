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
        // paceTheme: 'center-atom',
      });
    }
    // else {
    //   // Aggressive schema fix - ensure ALL required fields exist
    //   let needsUpdate = false;
    //   const updates = {};

    //   // Check and fix paceTheme
    //   if (!theme.paceTheme) {
    //     updates.paceTheme = 'center-atom';
    //     needsUpdate = true;
    //   }

    //   // Check and fix other required fields
    //   if (!theme.secondaryFont) {
    //     updates.secondaryFont = 'Courier New';
    //     needsUpdate = true;
    //   }

    //   if (!theme.siteTitle) {
    //     updates.siteTitle = "Logan's Run";
    //     needsUpdate = true;
    //   }

    //   if (!theme.primaryColor) {
    //     updates.primaryColor = '#e3ff05';
    //     needsUpdate = true;
    //   }

    //   if (!theme.secondaryColor) {
    //     updates.secondaryColor = '#f08080';
    //     needsUpdate = true;
    //   }

    //   if (!theme.primaryFont) {
    //     updates.primaryFont = 'SprayPaint';
    //     needsUpdate = true;
    //   }

    //   // Apply updates if needed
    //   if (needsUpdate) {
    //     Object.assign(theme, updates);
    //     await theme.save();
    //     console.log(
    //       '🔧 Auto-fixed theme schema on API call:',
    //       Object.keys(updates)
    //     );
    //   }
    // }
    res.json(theme);
  } catch (err) {
    console.error('Theme API error:', err);
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

// Health check endpoint - forces schema validation
// router.get('/api/health/db', async (req, res) => {
//   try {
//     console.log('🏥 Health check: Validating database schemas...');

//     // Force schema validation
//     const { validateAllSchemas } = require('../utils/schemaValidator');
//     await validateAllSchemas();

//     // Check theme state
//     const theme = await Theme.findOne();
//     const themeStatus = theme
//       ? {
//           exists: true,
//           hasPaceTheme: !!theme.paceTheme,
//           paceTheme: theme.paceTheme,
//           allFields: Object.keys(theme.toObject()),
//         }
//       : { exists: false };

//     res.json({
//       status: 'healthy',
//       timestamp: new Date().toISOString(),
//       theme: themeStatus,
//       message: 'Database schemas validated successfully',
//     });
//   } catch (error) {
//     console.error('Health check failed:', error);
//     res.status(500).json({
//       status: 'unhealthy',
//       error: error.message,
//       timestamp: new Date().toISOString(),
//     });
//   }
// });

module.exports = router;
