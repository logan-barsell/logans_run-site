const csrf = require('csrf');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');

// Create CSRF instance
const tokens = new csrf();

// Generate a secret for CSRF tokens (in production, use a persistent secret)
const secret = process.env.CSRF_SECRET || tokens.secretSync();

/**
 * CSRF Protection Middleware
 * Generates and validates CSRF tokens for state-changing operations
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF only for specific development endpoints that don't need it
  const skipCSRFRoutes = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/refresh',
    '/api/auth/logout',
  ];

  if (
    process.env.NODE_ENV === 'development' &&
    skipCSRFRoutes.includes(req.path)
  ) {
    logger.debug(
      `CSRF protection skipped for ${req.method} ${req.path} in development`
    );
    return next();
  }

  // Get token from header or body
  const token =
    req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;

  if (!token) {
    logger.warn(`CSRF token missing for ${req.method} ${req.path}`);
    return next(new AppError('CSRF token missing', 403));
  }

  // Verify token
  if (!tokens.verify(secret, token)) {
    logger.warn(`Invalid CSRF token for ${req.method} ${req.path}`);
    return next(new AppError('Invalid CSRF token', 403));
  }

  next();
};

/**
 * Generate CSRF Token Endpoint
 * Provides CSRF tokens to the frontend
 */
const generateCSRFToken = (req, res) => {
  const token = tokens.create(secret);
  res.json({
    success: true,
    data: {
      csrfToken: token,
    },
  });
};

/**
 * Add CSRF token to response locals for server-side rendering
 */
const addCSRFToken = (req, res, next) => {
  res.locals.csrfToken = tokens.create(secret);
  next();
};

module.exports = {
  csrfProtection,
  generateCSRFToken,
  addCSRFToken,
  secret, // Export for testing purposes
};
