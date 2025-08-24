const showsSettingsService = require('../services/showsSettingsService');
const { AppError } = require('../middleware/errorHandler');

class ShowsSettingsController {
  /**
   * Get shows settings
   */
  async getShowsSettings(req, res, next) {
    try {
      const settings = await showsSettingsService.getShowsSettings();
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(new AppError('Failed to fetch shows settings', 500));
    }
  }

  /**
   * Update shows settings
   */
  async updateShowsSettings(req, res, next) {
    try {
      const update = req.body;
      const result = await showsSettingsService.updateShowsSettings(update);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Shows settings data is required') {
        return next(new AppError('Shows settings data is required', 400));
      }
      next(new AppError('Failed to update shows settings', 500));
    }
  }
}

module.exports = new ShowsSettingsController();
