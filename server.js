const express = require('express');
require('dotenv').config();

// Import configurations
const {
  connectDatabase,
  corsMiddleware,
  helmetMiddleware,
  setupMiddleware,
  setupRoutes,
  setupMonitoring,
} = require('./config');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { generateCSRFToken } = require('./middleware/csrf');
const logger = require('./utils/logger');

// Connect to database
connectDatabase();

const app = express();

// Apply middleware
app.use(corsMiddleware);
app.use(helmetMiddleware);
setupMiddleware(app);
setupMonitoring(app);

// Setup routes
setupRoutes(app);

// Basic route
app.get('/', (req, res) => {
  res.send('EXPRESS ===> REACT');
});

// CSRF token endpoint
app.get('/api/csrf-token', generateCSRFToken);

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
