const TokenService = require('../services/tokenService');
const { AppError } = require('./errorHandler');
const UserService = require('../services/userService');
const SessionService = require('../services/sessionService');
const { clearAuthCookies } = require('../utils/cookie-utils');
const logger = require('../utils/logger');
const crypto = require('crypto');

// Validate JWT_SECRET on startup
const validateJWTSecret = () => {
  if (!process.env.JWT_SECRET && !process.env.ACCESS_TOKEN_SECRET) {
    logger.error(
      '⚠️  CRITICAL: JWT_SECRET or ACCESS_TOKEN_SECRET environment variable is not set!'
    );
    logger.error('   This is a major security vulnerability.');
    logger.error(
      '   Please set JWT_SECRET or ACCESS_TOKEN_SECRET in your .env file.'
    );

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'JWT_SECRET or ACCESS_TOKEN_SECRET must be set in production environment'
      );
    }

    // For development, generate a temporary secret
    const tempSecret = crypto.randomBytes(64).toString('hex');
    process.env.JWT_SECRET = tempSecret;
    logger.info('   Generated temporary JWT_SECRET for development.');
  }
};

// Call validation on module load
validateJWTSecret();

async function requireAuth(req, res, next) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;
  let decoded = null;

  try {
    if (accessToken) {
      decoded = TokenService.verifyAccessToken(accessToken);
    }
  } catch (error) {
    // Token verification failed, continue to refresh logic
  }

  const logoutUser = async () => {
    clearAuthCookies(res);
    const sessionId = req.user?.sessionId;
    const userId = req.user?.id;

    if (sessionId && userId) {
      // End only the current session
      await SessionService.endSession(sessionId, userId);
      // Revoke only the current session's refresh token
      await TokenService.revokeSessionRefreshToken(sessionId);
    }
  };

  try {
    if (!decoded && refreshToken) {
      const result = await TokenService.refreshAccessToken(req, res);
      decoded = TokenService.verifyAccessToken(result.accessToken);
    }

    if (!decoded) {
      await logoutUser();
      throw new AppError('Unauthorized - Please log in', 401);
    }

    const user = await UserService.findUserById(decoded.id);
    if (!user) {
      await logoutUser();
      throw new AppError('Unauthorized - User not found', 401);
    }

    if (user.status === 'INACTIVE') {
      await logoutUser();
      throw new AppError('Forbidden - Account deactivated', 403);
    }

    // NEW: Validate that the current session is still active
    const currentSession = await SessionService.getCurrentSession(
      decoded.sessionId,
      decoded.id
    );
    if (!currentSession || !currentSession.isActive) {
      await logoutUser();
      throw new AppError('Unauthorized - Session has been ended', 401);
    }

    req.user = {
      ...user.toObject(),
      sessionId: decoded.sessionId,
      id: decoded.id,
    };
    req.session = currentSession;
    next();
  } catch (error) {
    await logoutUser();
    next(error);
  }
}

module.exports = { requireAuth };
