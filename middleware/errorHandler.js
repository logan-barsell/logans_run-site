const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Determine status code
  const statusCode =
    (err instanceof AppError && err.statusCode) || err.status || 500;
  const logLevel = statusCode >= 500 ? 'error' : 'warn';

  // Create error details for logging
  const errorDetails = {
    requestId: req.id || 'unknown',
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  };

  // Log the error
  logger[logLevel](
    `❌ ${req.method} ${req.originalUrl} - ${err.message}`,
    errorDetails
  );

  // Rate limiting error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      statusCode: 429,
      retryAfter: req.get('Retry-After') || 60,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please log in again.',
      statusCode: 401,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired. Please log in again.',
      statusCode: 401,
    });
  }

  // Duplicate key error (generic)
  if (err.code === 'P2002' || err.code === 11000) {
    const field = err.meta?.target?.[0] || Object.keys(err.keyValue || {})[0];
    const message = field ? `${field} already exists.` : 'Duplicate value.';
    return res.status(400).json({
      success: false,
      message,
      statusCode: 400,
    });
  }

  // Default error response
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    statusCode,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: errorDetails,
    }),
  });
};

// Global catch for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === 'production') {
    logger.error('🔄 Shutting down server due to unhandled promise rejection');
    process.exit(1);
  }
});

// Global catch for uncaught exceptions
process.on('uncaughtException', error => {
  logger.error('💥 Uncaught Exception:', error);

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === 'production') {
    logger.error('🔄 Shutting down server due to uncaught exception');
    process.exit(1);
  }
});

module.exports = { errorHandler, AppError };
