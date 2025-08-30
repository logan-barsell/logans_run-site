const userService = require('../services/userService');
const SessionService = require('../services/sessionService');
const TokenService = require('../services/tokenService');
const { AppError } = require('../middleware/errorHandler');
const bcrypt = require('bcrypt');

class UserController {
  /**
   * Get current user information
   */
  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(new AppError('Failed to fetch user information', 500));
    }
  }

  /**
   * Update user information
   */
  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.user.id, req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error.message === 'User ID is required') {
        return next(new AppError('User ID is required', 400));
      }
      if (error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(new AppError('Failed to update user information', 500));
    }
  }

  /**
   * Initialize default user (admin only)
   */
  async initializeDefaultUser(req, res, next) {
    try {
      const user = await userService.initializeDefaultUser();
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
  async changePassword(req, res, next) {
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
      const user = await userService.findUserById(userId);
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

      // Update password
      await userService.updateUser(userId, { password: newPassword });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(new AppError('Failed to change password', 500));
    }
  }

  /**
   * Get user sessions
   */
  async getSessions(req, res, next) {
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
  async endSession(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      // Find and end the specific session
      const session = await SessionService.endSession(sessionId, userId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found',
        });
      }

      // If this is the current session, also revoke refresh tokens
      if (req.session && req.session.sessionId === sessionId) {
        await TokenService.revokeRefreshTokens(userId);
        // Clear cookies for current user
        const { clearAuthCookies } = require('../utils/cookie-utils');
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
  async endAllOtherSessions(req, res, next) {
    try {
      const userId = req.user.id;
      const currentSessionId = req.user.sessionId; // This would need to be added to the token

      const endedCount = await SessionService.endAllOtherSessions(
        userId,
        currentSessionId
      );

      res.status(200).json({
        success: true,
        message: `Ended ${endedCount} other sessions`,
        data: { endedCount },
      });
    } catch (error) {
      next(new AppError('Failed to end other sessions', 500));
    }
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

module.exports = new UserController();
