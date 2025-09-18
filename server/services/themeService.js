const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(
  __dirname,
  '../config/serviceAccountKey.json'
));
const { whitelistFields } = require('../utils/fieldWhitelist');

// Initialize Firebase if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yes-devil.appspot.com',
  });
}
const bucket = admin.storage().bucket();

// Theme allowed fields
const THEME_FIELDS = [
  'siteTitle',
  'greeting',
  'introduction',
  'bandLogoUrl',
  'bandHeaderLogoUrl',
  'headerDisplay',
  'headerPosition',
  'primaryColor',
  'secondaryColor',
  'backgroundColor',
  'primaryFont',
  'secondaryFont',
  'socialMediaIconStyle',
  'paceTheme',
  'displayMode',
  'enableNewsletter',
  'notifyOnNewShows',
  'notifyOnNewMusic',
  'notifyOnNewVideos',
];

async function getTheme(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      // First try to get tenant-specific theme
      let theme = await tx.theme.findUnique({ where: { tenantId } });

      // If no theme found, get default theme (RLS allows this)
      if (!theme) {
        theme = await tx.theme.findFirst({
          where: { isDefault: true },
        });
      }

      return theme; // may be null if no default theme exists
    });
  } catch (error) {
    logger.error('❌ Error fetching theme:', error);
    throw new AppError(
      error.message || 'Error fetching theme',
      error.statusCode || 500
    );
  }
}

async function updateTheme(tenantId, update) {
  try {
    if (!update) throw new AppError('Theme data is required', 400);

    const data = whitelistFields(update, THEME_FIELDS);

    // Handle old logo cleanup if bandLogoUrl is being updated
    if (data.bandLogoUrl && data.oldBandLogoUrl) {
      try {
        const oldLogoPath = data.oldBandLogoUrl.split('/').pop();
        if (oldLogoPath) {
          const file = bucket.file(`logos/${oldLogoPath}`);
          await file.delete();
          logger.info(`✅ Old logo deleted: ${oldLogoPath}`);
        }
      } catch (cleanupError) {
        logger.warn('Failed to delete old logo:', cleanupError);
        // Don't fail the update if logo cleanup fails
      }
      delete data.oldBandLogoUrl; // Remove from update data
    }

    // Handle old header logo cleanup if bandHeaderLogoUrl is being updated
    if (data.bandHeaderLogoUrl && data.oldBandHeaderLogoUrl) {
      try {
        const oldHeaderLogoPath = data.oldBandHeaderLogoUrl.split('/').pop();
        if (oldHeaderLogoPath) {
          const file = bucket.file(`logos/${oldHeaderLogoPath}`);
          await file.delete();
          logger.info(`✅ Old header logo deleted: ${oldHeaderLogoPath}`);
        }
      } catch (cleanupError) {
        logger.warn('Failed to delete old header logo:', cleanupError);
      }
      delete data.oldBandHeaderLogoUrl;
    }

    return await withTenant(tenantId, async tx => {
      const existing = await tx.theme.findUnique({ where: { tenantId } });
      if (!existing) {
        throw new AppError('Theme does not exist for tenant', 404);
      }

      const updated = await tx.theme.update({
        where: { tenantId },
        data,
      });
      logger.info('✅ Theme updated successfully');
      return updated;
    });
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
