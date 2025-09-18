const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

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

    // Remove old logo URLs from update data (cleanup handled by frontend)
    if (data.oldBandLogoUrl) {
      delete data.oldBandLogoUrl;
    }
    if (data.oldBandHeaderLogoUrl) {
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
