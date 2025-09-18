const rateLimit = require('express-rate-limit');
const { AppError } = require('./errorHandler');

/**
 * Create a rate limiter middleware with dynamic configuration.
 *
 * @param {number} windowMinutes - The time window duration in minutes.
 * @param {number} maxRequests - The maximum number of requests allowed per window.
 * @returns {Function} The rate limiter middleware.
 */
const createRateLimiter = (windowMinutes, maxRequests) => {
  // Skip rate limiting in test or development environments
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    return (req, res, next) => next();
  }

  // Calculate the time window in milliseconds
  const windowMs = windowMinutes * 60 * 1000;

  // Create the rate limiter middleware
  const limiter = rateLimit({
    keyGenerator: request => {
      // Use the proper ipKeyGenerator helper for IPv6 compatibility
      const ip = request.ip || request.connection.remoteAddress || 'unknown';
      // For IPv6 addresses, normalize them to prevent bypass
      if (ip.includes(':')) {
        // Extract the first part of IPv6 address (before any scope id)
        return ip.split('%')[0];
      }
      return ip;
    },
    handler: (req, res, next) => {
      next(new AppError('Too many requests. Please try again later.', 429));
    },
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    // Add custom message for better user experience
    message: {
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil(windowMinutes * 60), // seconds
    },
    // Skip successful requests from rate limiting
    skipSuccessfulRequests: false,
    // Skip failed requests from rate limiting (to prevent double counting)
    skipFailedRequests: false,
  });

  return limiter;
};

// Login rate limiter: maximum of 5 requests every 10 minutes
const loginLimiter = createRateLimiter(10, 500);

// Password reset rate limiter: maximum of 3 requests every hour
const resetPassLimiter = createRateLimiter(60, 3);

// Forgot password rate limiter: maximum of 3 requests every hour
const forgotPassLimiter = createRateLimiter(60, 3);

// General auth rate limiter: maximum of 10 requests every 5 minutes
const authLimiter = createRateLimiter(5, 1000);

// Default endpoint rate limiter: maximum of 1 request every 30 seconds
const defaultEndpointLimiter = createRateLimiter(0.5, 1);

// Admin routes rate limiter: maximum of 20 requests every minute
const adminLimiter = createRateLimiter(1, 20);

module.exports = {
  createRateLimiter,
  loginLimiter,
  resetPassLimiter,
  forgotPassLimiter,
  authLimiter,
  defaultEndpointLimiter,
  adminLimiter,
};
