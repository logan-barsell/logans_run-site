const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Shows settings allowed fields
const SHOWS_SETTINGS_FIELDS = ['showSystem', 'bandsintownArtist'];

async function getShowsSettings(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const settings = await tx.showsSettings.findUnique({
        where: { tenantId },
      });
      return settings; // may be null
    });
  } catch (error) {
    logger.error('❌ Error fetching shows settings:', error);
    throw new AppError(
      error.message || 'Error fetching shows settings',
      error.statusCode || 500
    );
  }
}

async function updateShowsSettings(tenantId, update) {
  try {
    if (!update || Object.keys(update).length === 0) {
      throw new AppError('Shows settings data is required', 400);
    }

    const data = whitelistFields(update, SHOWS_SETTINGS_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.showsSettings.findUnique({
        where: { tenantId },
      });
      if (!existing) {
        throw new AppError('Shows settings not found', 404);
      }
      const result = await tx.showsSettings.update({
        where: { tenantId },
        data,
      });
      logger.info('✅ Shows settings updated successfully');
      return result;
    });
  } catch (error) {
    logger.error('❌ Error updating shows settings:', error);
    throw new AppError(
      error.message || 'Error updating shows settings',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getShowsSettings,
  updateShowsSettings,
};
