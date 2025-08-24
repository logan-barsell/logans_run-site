const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Validate JWT_SECRET on startup
const validateJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    logger.error('⚠️  CRITICAL: JWT_SECRET environment variable is not set!');
    logger.error('   This is a major security vulnerability.');
    logger.error('   Please set JWT_SECRET in your .env file.');

    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
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

// JWT authentication middleware
function requireAuth(req, res, next) {
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

module.exports = { requireAuth };
