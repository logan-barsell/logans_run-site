// App configuration
const appConfig = require('./app');

// Configuration exports
module.exports = {
  // App config
  ...appConfig,

  // Modular configurations
  connectDatabase: require('./database'),
  corsMiddleware: require('./cors'),
  helmetMiddleware: require('./helmet'),
  setupMiddleware: require('./middleware'),
  setupRoutes: require('./routes'),
  setupMonitoring: require('./monitoring'),
};
