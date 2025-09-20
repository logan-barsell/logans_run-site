const UserService = require('../services/userService');
const SessionService = require('../services/sessionService');
const TokenService = require('../services/tokenService');
const BandsyteEmailService = require('../services/bandsyteEmailService');
const ThemeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');
const { clearAuthCookies } = require('../utils/cookie-utils');
const { getConfig } = require('../config/app');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

/**
 * Update user information
 */
async function updateUser(req, res, next) {
  try {
    const user = await UserService.updateUser(
      req.tenantId,
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('❌ Failed to update user:', error);
    next(error);
  }
}

/**
 * Change user password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return next(
        new AppError('Current password and new password are required', 400)
      );
    }

    // Get user with password
    const user = await UserService.findUserById(req.tenantId, userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password using the secure method
    await UserService.saveNewPassword(req.tenantId, userId, newPassword);

    // Send password change notification email
    try {
      const theme = await ThemeService.getTheme(req.tenantId);
      const bandName = theme.siteTitle || 'Bandsyte';

      await BandsyteEmailService.sendPasswordResetSuccessWithBranding(
        user.adminEmail,
        bandName,
        new Date().toLocaleString(),
        req.tenantId
      );
    } catch (emailError) {
      logger.error('Failed to send password change notification:', emailError);
      // Don't fail the password change if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('❌ Password change error:', error);
    next(error);
  }
}

/**
 * Get user sessions
 */
async function getSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { sessions, count } = await SessionService.getSessions(
      req.tenantId,
      userId,
      page,
      limit
    );

    // Format sessions for frontend
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      sessionId: session.sessionId,
      loginTime: session.loginTime,
      logoutTime: session.logoutTime,
      expiresAt: session.expiresAt,
      isActive: session.isActive,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      device: getDeviceInfo(session.userAgent),
      location: getLocationInfo(session.ipAddress),
    }));

    res.status(200).json({
      success: true,
      data: {
        sessions: formattedSessions,
        currentSessionId: req.user.sessionId, // Include current session ID
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    logger.error('❌ Failed to fetch sessions:', error);
    next(error);
  }
}

/**
 * End a specific session
 */
async function endSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const currentSessionId = req.user.sessionId; // From token
    const userId = req.user.id;

    // Find and end the specific session
    const session = await SessionService.endSession(
      req.tenantId,
      sessionId,
      userId
    );
    if (!session) {
      return next(new AppError('Session not found', 404));
    }

    // If ending current session, also revoke tokens and clear cookies
    if (sessionId === currentSessionId) {
      await TokenService.revokeSessionRefreshToken(sessionId);
      const requestDomain = req.headers.host || req.hostname;
      clearAuthCookies(res, requestDomain);
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to end session:', error);
    next(error);
  }
}

/**
 * End all other sessions (keep current one)
 */
async function endAllOtherSessions(req, res, next) {
  try {
    const userId = req.user.id;
    const currentSessionId = req.user.sessionId; // From token

    logger.info(
      `Ending all other sessions for user ${userId}, keeping session ${currentSessionId}`
    );

    const endedCount = await SessionService.endAllOtherSessions(
      req.tenantId,
      userId,
      currentSessionId
    );

    logger.info(
      `Successfully ended ${endedCount} other sessions for user ${userId}`
    );

    res.status(200).json({
      success: true,
      message: `Ended ${endedCount} other sessions`,
      data: { endedCount },
    });
  } catch (error) {
    logger.error('❌ Error ending other sessions:', error);
    next(error);
  }
}

// Helper functions
function getDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown Device';

  // Simple device detection
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux PC';

  return 'Desktop';
}

function getLocationInfo(ipAddress) {
  // For now, just return the IP. In production, you might want to use a geolocation service
  return ipAddress || 'Unknown Location';
}

module.exports = {
  updateUser,
  changePassword,
  getSessions,
  endSession,
  endAllOtherSessions,
};
