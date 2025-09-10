const SecurityPreferencesService = require('../services/securityPreferencesService');
const logger = require('../utils/logger');

/**
 * Get security preferences for the authenticated user
 */
async function getSecurityPreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await SecurityPreferencesService.getSecurityPreferences(
      req.tenantId,
      userId
    );

    if (!result.success) {
      throw new AppError(
        result.message || 'Failed to get security preferences',
        400
      );
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    logger.error('Error in getSecurityPreferences controller:', error);
    next(error);
  }
}

/**
 * Update security preferences for the authenticated user
 */
async function updateSecurityPreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const { loginAlerts, twoFactorEnabled } = req.body;

    const preferences = {};
    if (loginAlerts !== undefined) preferences.loginAlerts = loginAlerts;
    if (twoFactorEnabled !== undefined)
      preferences.twoFactorEnabled = twoFactorEnabled;

    const result = await SecurityPreferencesService.updateSecurityPreferences(
      req.tenantId,
      userId,
      preferences
    );

    if (!result.success) {
      throw new AppError(
        result.message || 'Failed to update security preferences',
        400
      );
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logger.error('Error in updateSecurityPreferences controller:', error);
    next(error);
  }
}

module.exports = {
  getSecurityPreferences,
  updateSecurityPreferences,
};
