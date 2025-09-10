const TokenService = require('../services/tokenService');
const { AppError } = require('./errorHandler');
const UserService = require('../services/userService');
const SessionService = require('../services/sessionService');
const { clearAuthCookies } = require('../utils/cookie-utils');
const logger = require('../utils/logger');
const crypto = require('crypto');

// Validate JWT secrets on startup
const validateJWTSecret = () => {
  // Validate ACCESS_TOKEN_SECRET
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

  // Validate REFRESH_TOKEN_SECRET
  if (!process.env.REFRESH_TOKEN_SECRET) {
    logger.warn('⚠️ REFRESH_TOKEN_SECRET not set, using ACCESS_TOKEN_SECRET');
    logger.warn('   For better security, set a separate REFRESH_TOKEN_SECRET');
    if (process.env.NODE_ENV === 'production') {
      logger.error(
        '   REFRESH_TOKEN_SECRET should be set in production for security'
      );
    }
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
    // Access token verification failed, continue to refresh logic
    logger.debug('Access token verification failed, attempting refresh');
  }

  const logoutUser = async () => {
    clearAuthCookies(res);
    const sessionId = req.user?.sessionId;
    const userId = req.user?.id;

    if (sessionId && userId) {
      // End only the current session
      await SessionService.endSession(req.tenantId, sessionId, userId);
      // Revoke only the current session's refresh token
      await TokenService.revokeSessionRefreshToken(sessionId);
    }
  };

  try {
    // Attempt to refresh tokens if access token is invalid/expired
    if (!decoded && refreshToken) {
      try {
        logger.debug('🔄 Attempting token refresh');
        const result = await TokenService.refreshAccessToken(req, res);
        decoded = TokenService.verifyAccessToken(result.accessToken);
        logger.debug('✅ Token refresh successful');
      } catch (refreshError) {
        logger.warn('❌ Token refresh failed:', refreshError.message);
        // Continue to logout logic below
      }
    }

    if (!decoded) {
      logger.warn('❌ No valid tokens found, logging out user');
      await logoutUser();
      throw new AppError('Unauthorized - Please log in', 401);
    }

    const user = await UserService.findUserById(req.tenantId, decoded.id);
    if (!user) {
      logger.warn(`❌ User not found: ${decoded.id}`);
      await logoutUser();
      throw new AppError('Unauthorized - User not found', 401);
    }

    if (user.status === 'INACTIVE') {
      logger.warn(`❌ Inactive user attempted access: ${decoded.id}`);
      await logoutUser();
      throw new AppError('Forbidden - Account deactivated', 403);
    }

    // Validate that the current session is still active
    const currentSession = await SessionService.getCurrentSession(
      req.tenantId,
      decoded.sessionId,
      decoded.id
    );
    if (!currentSession || !currentSession.isActive) {
      logger.warn(`❌ Session ended: ${decoded.sessionId}`);
      await logoutUser();
      throw new AppError('Unauthorized - Session has been ended', 401);
    }

    req.user = {
      ...user,
      sessionId: decoded.sessionId,
      id: decoded.id,
    };
    req.session = currentSession;
    next();
  } catch (error) {
    // Ensure user is logged out on any auth failure
    await logoutUser();
    next(error);
  }
}

module.exports = { requireAuth };
