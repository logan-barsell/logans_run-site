const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');

/**
 * Get security preferences for a user
 */
async function getSecurityPreferences(tenantId, userId) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.findUnique({
        where: { id: userId },
        select: { securityPreferences: true, twoFactorEnabled: true },
      })
    );

    if (!user) {
      throw new AppError('User not found', 404);
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
async function updateSecurityPreferences(tenantId, userId, preferences) {
  try {
    // Ensure user exists first
    const existing = await withTenant(tenantId, async tx =>
      tx.user.findUnique({ where: { id: userId }, select: { id: true } })
    );
    if (!existing) {
      throw new AppError('User not found', 404);
    }

    const data = {};
    if (preferences.loginAlerts !== undefined) {
      data.securityPreferences = { loginAlerts: preferences.loginAlerts };
    }
    if (preferences.twoFactorEnabled !== undefined) {
      data.twoFactorEnabled = preferences.twoFactorEnabled;
    }

    const updated = await withTenant(tenantId, async tx =>
      tx.user.update({
        where: { id: userId },
        data,
        select: { securityPreferences: true, twoFactorEnabled: true },
      })
    );

    return {
      success: true,
      message: 'Security preferences updated successfully',
      data: {
        loginAlerts: updated.securityPreferences?.loginAlerts ?? false,
        twoFactorEnabled: updated.twoFactorEnabled ?? false,
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
async function isLoginAlertsEnabled(tenantId, userId) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.findUnique({
        where: { id: userId },
        select: { securityPreferences: true },
      })
    );

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
