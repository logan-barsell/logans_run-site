const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const TokenService = require('../services/tokenService');
const { AppError } = require('../middleware/errorHandler');
const { setAuthCookies, clearAuthCookies } = require('../utils/cookie-utils');
const { getClientIp } = require('../utils/request-utils');
const logger = require('../utils/logger');
const config = require('../config');

class AuthController {
  /**
   * Login endpoint
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Basic input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const ip = getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await AuthService.login({
        email,
        password,
        ip,
        userAgent,
      });

      // Set cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      logger.info(`User logged in successfully: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  }

  /**
   * Signup endpoint
   */
  async signup(req, res, next) {
    try {
      const { email, password, firstName, lastName, userType } = req.body;

      // Basic input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const ip = getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      const result = await AuthService.signup({
        email,
        password,
        firstName,
        lastName,
        userType,
        ip,
        userAgent,
      });

      // Set cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      logger.info(`User signed up successfully: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Signup successful',
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      logger.error('Signup error:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'There was a problem signing up, please try again',
        });
      }
    }
  }

  /**
   * Logout endpoint
   */
  async logout(req, res, next) {
    try {
      let ip = getClientIp(req);

      logger.info(
        `🚪 Logout request received for user ${req.user?.adminEmail} from IP: ${ip}`
      );

      if (req.user?._id) {
        await UserService.endAllUserSessions(req.user._id.toString(), true);
      }

      clearAuthCookies(res);

      logger.info(`✅ Successful logout`, { ip });

      res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token endpoint
   */
  async refresh(req, res, next) {
    try {
      const result = await TokenService.refreshAccessToken(req, res);
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          userId: result.userId,
        },
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      clearAuthCookies(res);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed',
      });
    }
  }

  /**
   * Check authentication status
   */
  async checkAuth(req, res, next) {
    try {
      const user = await UserService.getUserById(req.user._id);
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            bandName: user.bandName,
            adminEmail: user.adminEmail,
            role: user.role,
            userType: user.userType,
            verified: user.verified,
            status: user.status,
          },
        },
      });
    } catch (error) {
      logger.error('Auth check error:', error);
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
    }
  }

  /**
   * Email verification endpoint
   */
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required',
        });
      }

      const user = await AuthService.verifyEmail(token);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: {
          user: {
            id: user._id,
            adminEmail: user.adminEmail,
            verified: user.verified,
          },
        },
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Email verification failed',
      });
    }
  }

  /**
   * Request password reset endpoint
   */
  async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      await AuthService.requestPasswordReset(email);

      // Don't reveal if email exists or not for security
      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
    } catch (error) {
      logger.error('Password reset request error:', error);
      // Still return success to not reveal if email exists
      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      });
    }
  }

  /**
   * Reset password endpoint
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Token and new password are required',
        });
      }

      await AuthService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      logger.error('Password reset error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Password reset failed',
      });
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required',
        });
      }

      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.verified) {
        return res.status(400).json({
          success: false,
          message: 'Email is already verified',
        });
      }

      await AuthService.sendEmailVerification(
        user._id.toString(),
        user.adminEmail,
        user.role
      );

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (error) {
      logger.error('Resend verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send verification email',
      });
    }
  }

  /**
   * Initialize default user (admin only)
   */
  async initializeDefaultUser(req, res, next) {
    try {
      const user = await UserService.initializeDefaultUser();
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            bandName: user.bandName,
            adminEmail: user.adminEmail,
            role: user.role,
            userType: user.userType,
            verified: user.verified,
            status: user.status,
          },
        },
        message: 'Default user initialized successfully',
      });
    } catch (error) {
      logger.error('Initialize user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize default user',
      });
    }
  }
}

module.exports = new AuthController();
