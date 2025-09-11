const morgan = require('morgan');
const compression = require('compression');
const statusMonitor = require('express-status-monitor');
const logger = require('../utils/logger');
const { prisma } = require('../db/prisma');

/**
 * Request logging middleware with custom format
 */
const requestLogger =
  process.env.DISABLE_REQUEST_LOGGING === 'true'
    ? (req, res, next) => next() // Skip logging entirely
    : morgan(
        (tokens, req, res) => {
          const method = tokens.method(req, res);
          const url = tokens.url(req, res);
          const status = tokens.status(req, res);
          const responseTime = tokens['response-time'](req, res);
          const contentLength = tokens.res(req, res, 'content-length');
          const ip = req.ip || req.connection.remoteAddress;

          // Only log meaningful requests (exclude static assets, health checks, etc.)
          const shouldLog =
            !url.includes('/static/') &&
            !url.includes('/favicon.ico') &&
            !url.includes('/robots.txt') &&
            !url.includes('/api/health') &&
            !url.includes('/status') &&
            !url.includes('/metrics');

          if (shouldLog) {
            const logData = {
              method,
              url,
              status: parseInt(status),
              responseTime: parseFloat(responseTime),
              contentLength: contentLength ? parseInt(contentLength) : 0,
              ip,
              userAgent: tokens['user-agent'](req, res),
              timestamp: new Date().toISOString(),
            };

            // Smart logging based on environment and log level
            const logLevel = process.env.LOG_LEVEL || 'info';
            const isProduction = process.env.NODE_ENV === 'production';

            if (isProduction) {
              // Production: Only log errors and slow requests
              if (res.statusCode >= 400) {
                logger.warn('HTTP Error', logData);
              } else if (parseFloat(responseTime) > 1000) {
                logger.warn('Slow Request', logData);
              }
            } else {
              // Development: Respect LOG_LEVEL
              if (logLevel === 'debug') {
                // Debug: Log everything
                if (res.statusCode >= 400) {
                  logger.warn(
                    `${method} ${url} - ${status} (${responseTime}ms)`
                  );
                } else {
                  logger.info(
                    `${method} ${url} - ${status} (${responseTime}ms)`
                  );
                }
              } else if (logLevel === 'info') {
                // Info: Log errors and API requests only
                if (res.statusCode >= 400 || url.startsWith('/api/')) {
                  if (res.statusCode >= 400) {
                    logger.warn(
                      `${method} ${url} - ${status} (${responseTime}ms)`
                    );
                  } else {
                    logger.info(
                      `${method} ${url} - ${status} (${responseTime}ms)`
                    );
                  }
                }
              } else if (logLevel === 'warn') {
                // Warn: Only log errors
                if (res.statusCode >= 400) {
                  logger.warn(
                    `${method} ${url} - ${status} (${responseTime}ms)`
                  );
                }
              }
              // 'error' level: Don't log any requests
            }
          }

          // Return empty string to prevent Morgan from writing to stdout
          return '';
        },
        {
          stream: {
            write: message => {
              // Morgan writes to stdout, we handle logging above
            },
          },
        }
      );

/**
 * Performance monitoring configuration
 */
const statusMonitorConfig = {
  title: 'Bandsyte API Status',
  theme: 'default.css',
  path: '/status',
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 data points
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    },
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/api/health',
      port: process.env.PORT || 5001,
    },
  ],
  ignoreStartsWith: '/status', // Don't monitor the status page itself
};

/**
 * Health check endpoint
 */
const healthCheck = (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
    },
    database: {
      status: 'connected', // You can add actual DB health check here
    },
  };

  res.status(200).json({
    success: true,
    data: health,
  });
};

/**
 * Detailed health check endpoint
 */
const detailedHealthCheck = async (req, res) => {
  try {
    // Check database connectivity via a lightweight query
    let databaseStatus = 'connected';
    try {
      // SELECT 1 works across most SQL databases supported by Prisma
      // eslint-disable-next-line no-unused-vars
      const _ = await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      databaseStatus = 'disconnected';
    }

    const health = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      database: {
        status: databaseStatus,
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid,
      },
    };

    // Degrade overall status if database is disconnected
    const success = databaseStatus === 'connected';
    if (!success) health.status = 'DEGRADED';

    res.status(success ? 200 : 503).json({
      success,
      data: health,
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      data: {
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
    });
  }
};

/**
 * Metrics endpoint for external monitoring
 */
const metrics = (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
      rss: process.memoryUsage().rss,
    },
    cpu: process.cpuUsage(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json({
    success: true,
    data: metrics,
  });
};

// Log monitoring configuration on startup
const logLevel = process.env.LOG_LEVEL || 'info';
const isProduction = process.env.NODE_ENV === 'production';
const requestLoggingDisabled = process.env.DISABLE_REQUEST_LOGGING === 'true';

logger.info('🔍 Monitoring Configuration', {
  environment: process.env.NODE_ENV || 'development',
  logLevel,
  requestLogging: requestLoggingDisabled ? 'disabled' : 'enabled',
  productionMode: isProduction,
  healthChecks: 'enabled',
  statusMonitor: 'enabled',
  compression: 'enabled',
});

module.exports = {
  requestLogger,
  compression: compression(),
  statusMonitor: statusMonitor(statusMonitorConfig),
  healthCheck,
  detailedHealthCheck,
  metrics,
};
