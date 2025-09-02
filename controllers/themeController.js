const ThemeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

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
    logger.error('❌ Failed to fetch theme:', error);
    next(error);
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
    logger.error('❌ Failed to update theme:', error);
    next(error);
  }
}

module.exports = {
  getTheme,
  updateTheme,
};
