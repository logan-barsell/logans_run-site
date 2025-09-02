const Theme = require('../models/Theme');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(
  __dirname,
  '../config/serviceAccountKey.json'
));

// Initialize Firebase if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com',
  });
}
const bucket = admin.storage().bucket();

/**
 * Get theme, create default if none exists
 */
async function getTheme() {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      // Provide default theme if none exists
      theme = await Theme.create({
        siteTitle: 'Band Site',
        primaryColor: '#e3ff05',
        secondaryColor: '#f08080',
        primaryFont: 'SprayPaint',
        secondaryFont: 'Courier New',
        greeting: 'HELLO.',
        introduction: 'Welcome to our site',
        paceTheme: 'minimal',
      });
      logger.info('✅ Default theme created');
    } else {
      // Aggressive schema fix - ensure ALL required fields exist
      let needsUpdate = false;
      const updates = {};

      // Check and fix paceTheme
      if (!theme.paceTheme) {
        updates.paceTheme = 'minimal';
        needsUpdate = true;
      }

      // Check and fix other required fields
      if (!theme.secondaryFont) {
        updates.secondaryFont = 'RobotoCondensed';
        needsUpdate = true;
      }

      if (!theme.greeting) {
        updates.greeting = 'HELLO.';
        needsUpdate = true;
      }
      if (!theme.introduction) {
        updates.introduction = 'Welcome to our site';
        needsUpdate = true;
      }

      if (!theme.siteTitle) {
        updates.siteTitle = 'Band Site';
        needsUpdate = true;
      }

      if (!theme.primaryColor) {
        updates.primaryColor = '#e3ff05';
        needsUpdate = true;
      }

      if (!theme.secondaryColor) {
        updates.secondaryColor = '#f08080';
        needsUpdate = true;
      }

      if (!theme.primaryFont) {
        updates.primaryFont = 'SprayPaint';
        needsUpdate = true;
      }

      // Apply updates if needed
      if (needsUpdate) {
        Object.assign(theme, updates);
        await theme.save();
        logger.info(
          '🔧 Auto-fixed theme schema on API call:',
          Object.keys(updates)
        );
      }
    }
    return theme;
  } catch (error) {
    logger.error('❌ Error fetching theme:', error);
    throw new AppError(
      error.message || 'Error fetching theme',
      error.statusCode || 500
    );
  }
}

/**
 * Update or create theme
 */
async function updateTheme(update) {
  try {
    if (!update) {
      throw new AppError('Theme data is required', 400);
    }

    let theme = await Theme.findOne();
    const { bandLogoUrl, oldBandLogoUrl } = update;

    if (theme) {
      Object.assign(theme, update);
      await theme.save();
      logger.info('✅ Theme updated successfully');
    } else {
      theme = await Theme.create(update);
      logger.info('✅ New theme created successfully');
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
            logger.error('Firebase delete error:', err);
          });
      } else {
        logger.warn(
          'Could not extract Firebase file path from URL:',
          oldBandLogoUrl
        );
      }
    }

    return theme;
  } catch (error) {
    logger.error('❌ Error updating theme:', error);
    throw new AppError(
      error.message || 'Error updating theme',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getTheme,
  updateTheme,
};
