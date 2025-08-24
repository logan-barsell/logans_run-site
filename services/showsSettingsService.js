const ShowsSettings = require('../models/ShowsSettings');
const logger = require('../utils/logger');

class ShowsSettingsService {
  /**
   * Get shows settings, create default if none exists
   */
  async getShowsSettings() {
    try {
      let settings = await ShowsSettings.findOne();
      if (!settings) {
        settings = await ShowsSettings.create({});
        logger.info('Created new shows settings');
      }
      return settings;
    } catch (error) {
      logger.error('Error fetching shows settings:', error);
      throw error;
    }
  }

  /**
   * Update or create shows settings
   */
  async updateShowsSettings(update) {
    try {
      if (!update) {
        throw new Error('Shows settings data is required');
      }

      let settings = await ShowsSettings.findOne();
      if (settings) {
        Object.assign(settings, update);
        await settings.save();
        logger.info('Shows settings updated successfully');
      } else {
        settings = await ShowsSettings.create(update);
        logger.info('Shows settings created successfully');
      }
      return settings;
    } catch (error) {
      logger.error('Error updating shows settings:', error);
      throw error;
    }
  }
}

module.exports = new ShowsSettingsService();
