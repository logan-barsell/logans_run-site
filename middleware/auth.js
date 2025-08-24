const TokenService = require('../services/tokenService');
const { AppError } = require('./errorHandler');
const UserService = require('../services/userService');
const { clearAuthCookies } = require('../utils/cookie-utils');
const logger = require('../utils/logger');

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
    const crypto = require('crypto');
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
    const id = req.user?._id?.toString();
    if (id) {
      await UserService.endAllUserSessions(id, true);
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

    req.user = user;
    next();
  } catch (error) {
    await logoutUser();
    next(error);
  }
}

// Legacy requireAuth for backward compatibility
function requireAuthLegacy(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(
      `Authentication failed for IP: ${req.ip}, Error: ${err.message}`
    );
    return res.status(401).json({ authenticated: false });
  }
}

module.exports = { requireAuth, requireAuthLegacy };
