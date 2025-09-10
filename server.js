const express = require('express');
require('dotenv').config();

// Import configurations
const { setupMiddleware, setupRoutes, setupMonitoring } = require('./config');

// Import error handler
const { errorHandler } = require('./middleware/errorHandler');
// Import logger
const logger = require('./utils/logger');

const app = express();

// Apply middleware
setupMiddleware(app);
setupMonitoring(app);

// Setup routes
setupRoutes(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📅 Server started at: ${new Date().toISOString()}`);
});
