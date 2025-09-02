const ShowsSettingsService = require('../services/showsSettingsService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get shows settings
 */
async function getShowsSettings(req, res, next) {
  try {
    const settings = await ShowsSettingsService.getShowsSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch shows settings:', error);
    next(error);
  }
}

/**
 * Update shows settings
 */
async function updateShowsSettings(req, res, next) {
  try {
    const update = req.body;
    const result = await ShowsSettingsService.updateShowsSettings(update);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to update shows settings:', error);
    next(error);
  }
}

module.exports = {
  getShowsSettings,
  updateShowsSettings,
};
