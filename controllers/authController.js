const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const TokenService = require('../services/tokenService');
const SessionService = require('../services/sessionService');
const { AppError } = require('../middleware/errorHandler');
const { setAuthCookies, clearAuthCookies } = require('../utils/cookie-utils');
const { getConfig } = require('../config/app');
const { getClientIp } = require('../utils/request-utils');
const logger = require('../utils/logger');
const BandsyteEmailService = require('../services/bandsyteEmailService');
const ThemeService = require('../services/themeService');
const SecurityPreferencesService = require('../services/securityPreferencesService');
const TwoFactorService = require('../services/twoFactorService');

/**
 * Login endpoint
 */
async function login(req, res, next) {
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
      tenantId: req.tenantId,
      email,
      password,
      ip,
      userAgent,
    });

    // Check if 2FA is required
    if (result.requiresTwoFactor) {
      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        requiresTwoFactor: true,
        data: {
          userId: result.userId,
          user: result.user,
          codeSent: result.codeSent,
        },
      });
    }

    // Set cookies for normal login
    const config = await getConfig(req.tenantId);
    setAuthCookies(res, result.accessToken, result.refreshToken, config.domain);

    logger.info(`User logged in successfully: ${email}`);

    // Send login alert if user has it enabled
    try {
      const loginAlertsEnabled =
        await SecurityPreferencesService.isLoginAlertsEnabled(
          req.tenantId,
          result.user.id
        );

      if (loginAlertsEnabled) {
        const theme = await ThemeService.getTheme(req.tenantId);
        const bandName = theme.siteTitle || 'Bandsyte';
        await BandsyteEmailService.sendLoginAlertWithBranding(
          email,
          bandName,
          ip,
          userAgent,
          'Unknown',
          req.tenantId
        );
        logger.info(`📧 Login alert sent to user ${email}`);
      }
    } catch (emailError) {
      logger.error('Failed to send login alert:', emailError);
      // Don't fail the login if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
}

/**
 * Complete 2FA login endpoint
 */
async function completeTwoFactorLogin(req, res, next) {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: 'User ID and verification code are required',
      });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Verify the 2FA code first
    await TwoFactorService.verifyTwoFactorCode(req.tenantId, userId, code);

    // Complete the login process
    const result = await AuthService.completeTwoFactorLogin({
      tenantId: req.tenantId,
      userId,
      ip,
      userAgent,
    });

    // Set cookies
    const config = await getConfig(req.tenantId);
    setAuthCookies(res, result.accessToken, result.refreshToken, config.domain);

    logger.info(`User completed 2FA login successfully: ${userId}`);

    // Send login alert if user has it enabled
    try {
      const loginAlertsEnabled =
        await SecurityPreferencesService.isLoginAlertsEnabled(
          req.tenantId,
          userId
        );

      if (loginAlertsEnabled) {
        const theme = await ThemeService.getTheme(req.tenantId);
        const bandName = theme.siteTitle || 'Bandsyte';
        const user = await UserService.findUserById(req.tenantId, userId);
        await BandsyteEmailService.sendLoginAlertWithBranding(
          user.adminEmail,
          bandName,
          ip,
          userAgent,
          'Unknown',
          req.tenantId
        );
        logger.info(`📧 Login alert sent to user ${user.adminEmail}`);
      }
    } catch (emailError) {
      logger.error('Failed to send login alert:', emailError);
      // Don't fail the login if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    logger.error('2FA login error:', error);
    next(error);
  }
}

/**
 * Signup endpoint
 */
async function signup(req, res, next) {
  try {
    const { email, password, userType } = req.body;

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
      tenantId: req.tenantId,
      email,
      password,
      userType,
      ip,
      userAgent,
    });

    // Set cookies
    const config = await getConfig(req.tenantId);
    setAuthCookies(res, result.accessToken, result.refreshToken, config.domain);

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
    next(error);
  }
}

/**
 * Logout endpoint
 */
async function logout(req, res, next) {
  try {
    let ip = getClientIp(req);
    const sessionId = req.user.sessionId;
    const userId = req.user.id;

    logger.info(
      `🚪 Logout request received for user ${req.user?.adminEmail} from IP: ${ip}, session: ${sessionId}`
    );

    // End only this specific session
    await SessionService.endSession(req.tenantId, sessionId, userId);

    // Revoke only this session's refresh token
    await TokenService.revokeSessionRefreshToken(sessionId);

    clearAuthCookies(res);

    logger.info(`✅ Successful logout for session ${sessionId}`, { ip });

    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    logger.error('Error during logout:', error);
    next(error);
  }
}

/**
 * Refresh token endpoint
 */
async function refresh(req, res, next) {
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
    next(error);
  }
}

/**
 * Check authentication status and return full user data
 */
async function checkAuth(req, res, next) {
  try {
    const user = await UserService.getUserById(req.tenantId, req.user.id);
    res.status(200).json({
      success: true,
      data: user, // Return full user object like /user/me
    });
  } catch (error) {
    logger.error('Auth check error:', error);
    next(error);
  }
}

/**
 * Email verification endpoint
 */
async function verifyEmail(req, res, next) {
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
          id: user.id,
          adminEmail: user.adminEmail,
          verified: user.verified,
        },
      },
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
}

/**
 * Request password reset endpoint
 */
async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    await AuthService.requestPasswordReset(req.tenantId, email);

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
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    await AuthService.resetPassword(req.tenantId, token, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    logger.error('Password reset error:', error);
    next(error);
  }
}

/**
 * Resend email verification
 */
async function resendEmailVerification(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const user = await UserService.getUserByEmail(req.tenantId, email);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.verified) {
      throw new AppError('Email is already verified', 400);
    }

    await AuthService.sendEmailVerificationWithToken(
      req.tenantId,
      user.id,
      user.adminEmail,
      user.role
    );

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    logger.error('Resend verification error:', error);
    next(error);
  }
}

module.exports = {
  login,
  completeTwoFactorLogin,
  signup,
  logout,
  refresh,
  checkAuth,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  resendEmailVerification,
};
