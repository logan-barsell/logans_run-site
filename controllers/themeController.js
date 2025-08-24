const themeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');

class ThemeController {
  /**
   * Get theme
   */
  async getTheme(req, res, next) {
    try {
      const theme = await themeService.getTheme();
      res.json({
        success: true,
        data: theme,
      });
    } catch (error) {
      next(new AppError('Failed to fetch theme', 500));
    }
  }

  /**
   * Update theme
   */
  async updateTheme(req, res, next) {
    try {
      const update = req.body;
      const result = await themeService.updateTheme(update);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Theme data is required') {
        return next(new AppError('Theme data is required', 400));
      }
      next(new AppError('Failed to update theme', 500));
    }
  }
}

module.exports = new ThemeController();
