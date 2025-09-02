const ShowsSettings = require('../models/ShowsSettings');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get shows settings, create default if none exists
 */
async function getShowsSettings() {
  try {
    let settings = await ShowsSettings.findOne();
    if (!settings) {
      settings = await ShowsSettings.create({});
      logger.info('✅ Created new shows settings');
    }
    return settings;
  } catch (error) {
    logger.error('❌ Error fetching shows settings:', error);
    throw new AppError(
      error.message || 'Error fetching shows settings',
      error.statusCode || 500
    );
  }
}

/**
 * Update or create shows settings
 */
async function updateShowsSettings(update) {
  try {
    if (!update) {
      throw new AppError('Shows settings data is required', 400);
    }

    let settings = await ShowsSettings.findOne();
    if (settings) {
      Object.assign(settings, update);
      await settings.save();
      logger.info('✅ Shows settings updated successfully');
    } else {
      settings = await ShowsSettings.create(update);
      logger.info('✅ Shows settings created successfully');
    }
    return settings;
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
