const UserService = require('../services/userService');
const SessionService = require('../services/sessionService');
const TokenService = require('../services/tokenService');
const EmailService = require('../services/emailService');
const ThemeService = require('../services/themeService');
const { AppError } = require('../middleware/errorHandler');
const { clearAuthCookies } = require('../utils/cookie-utils');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

/**
 * Update user information
 */
async function updateUser(req, res, next) {
  try {
    const user = await UserService.updateUserWithIdentifier(
      req.user.id,
      req.body,
      true
    );
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Initialize default user (admin only)
 */
async function initializeDefaultUser(req, res, next) {
  try {
    const user = await UserService.initializeDefaultUser();
    res.status(200).json({
      success: true,
      data: user,
      message: 'Default user initialized successfully',
    });
  } catch (error) {
    next(new AppError('Failed to initialize default user', 500));
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
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    // Get user with password
    const user = await UserService.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password using the secure method
    await UserService.saveNewPassword(userId, newPassword);

    // Send password change notification email
    try {
      const theme = await ThemeService.getTheme();
      const bandName = theme.siteTitle || 'Bandsyte';

      await EmailService.sendPasswordResetSuccess(user.adminEmail, bandName);
    } catch (emailError) {
      logger.error('Failed to send password change notification:', emailError);
      // Don't fail the password change if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Password change error details:', error);
    next(new AppError('Failed to change password', 500));
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
      userId,
      page,
      limit
    );

    // Format sessions for frontend
    const formattedSessions = sessions.map(session => ({
      id: session._id,
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
    next(new AppError('Failed to fetch sessions', 500));
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
    const session = await SessionService.endSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // If ending current session, also revoke tokens and clear cookies
    if (sessionId === currentSessionId) {
      await TokenService.revokeSessionRefreshToken(sessionId);
      clearAuthCookies(res);
    }

    res.status(200).json({
      success: true,
      message: 'Session ended successfully',
    });
  } catch (error) {
    next(new AppError('Failed to end session', 500));
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
    logger.error('Error ending other sessions:', error);
    next(new AppError('Failed to end other sessions', 500));
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
  initializeDefaultUser,
  changePassword,
  getSessions,
  endSession,
  endAllOtherSessions,
};
