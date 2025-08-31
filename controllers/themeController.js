const ThemeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get theme
 */
async function getTheme(req, res, next) {
  try {
    const theme = await ThemeService.getTheme();
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
async function updateTheme(req, res, next) {
  try {
    const update = req.body;
    const result = await ThemeService.updateTheme(update);
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

module.exports = {
  getTheme,
  updateTheme,
};
