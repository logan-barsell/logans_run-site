const setupMonitoring = app => {
  const {
    requestLogger,
    compression,
    statusMonitor,
    healthCheck,
    detailedHealthCheck,
    metrics,
  } = require('../middleware/monitoring');

  // Monitoring and performance
  app.use(compression); // Enable gzip compression
  app.use(requestLogger); // Request logging
  app.use(statusMonitor); // Real-time monitoring dashboard

  // Monitoring endpoints
  app.get('/api/health', healthCheck);
  app.get('/api/health/detailed', detailedHealthCheck);
  app.get('/api/metrics', metrics);

  return {
    healthCheck,
    detailedHealthCheck,
    metrics,
  };
};

module.exports = setupMonitoring;
