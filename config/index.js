// App configuration
const appConfig = require('./app');

// Configuration exports
module.exports = {
  // App config
  ...appConfig,

  // Modular configurations
  corsMiddleware: require('./cors'),
  helmetMiddleware: require('./helmet'),
  setupMiddleware: require('./middleware'),
  setupRoutes: require('./routes'),
  setupMonitoring: require('./monitoring'),
};
