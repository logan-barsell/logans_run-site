const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Get security preferences for a user
 */
async function getSecurityPreferences(userId) {
  try {
    const user = await User.findById(userId).select(
      'securityPreferences twoFactorEnabled'
    );

    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      data: {
        loginAlerts: user.securityPreferences?.loginAlerts ?? false,
        twoFactorEnabled: user.twoFactorEnabled ?? false,
      },
    };
  } catch (error) {
    logger.error('Error getting security preferences:', error);
    return {
      success: false,
      message: error.message || 'Failed to get security preferences',
    };
  }
}

/**
 * Update security preferences for a user
 */
async function updateSecurityPreferences(userId, preferences) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update security preferences
    if (preferences.loginAlerts !== undefined) {
      user.securityPreferences = user.securityPreferences || {};
      user.securityPreferences.loginAlerts = preferences.loginAlerts;
    }

    if (preferences.twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = preferences.twoFactorEnabled;
    }

    await user.save();

    return {
      success: true,
      message: 'Security preferences updated successfully',
      data: {
        loginAlerts: user.securityPreferences?.loginAlerts ?? false,
        twoFactorEnabled: user.twoFactorEnabled ?? false,
      },
    };
  } catch (error) {
    logger.error('Error updating security preferences:', error);
    return {
      success: false,
      message: error.message || 'Failed to update security preferences',
    };
  }
}

/**
 * Check if user has login alerts enabled
 */
async function isLoginAlertsEnabled(userId) {
  try {
    const user = await User.findById(userId).select('securityPreferences');

    if (!user) {
      return false;
    }

    return user.securityPreferences?.loginAlerts ?? false;
  } catch (error) {
    logger.error('Error checking login alerts preference:', error);
    return false;
  }
}

module.exports = {
  getSecurityPreferences,
  updateSecurityPreferences,
  isLoginAlertsEnabled,
};
