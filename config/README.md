# Configuration Structure

This directory contains all the configuration files for the Logans Run application, organized in a modular and maintainable way.

## Files Overview

### Core Configuration

- **`app.js`** - Application-specific configuration (environment, URLs, domain settings)
- **`keys.js`** - Database and external service keys (environment-specific)
- **`dev.js`** - Development environment configuration
- **`prod.js`** - Production environment configuration

### Modular Configurations

- **`cors.js`** - CORS (Cross-Origin Resource Sharing) configuration
- **`helmet.js`** - Helmet security headers configuration
- **`database.js`** - Database connection and setup
- **`middleware.js`** - Express middleware setup (body parser, cookie parser, static files)
- **`routes.js`** - API route registration
- **`monitoring.js`** - Monitoring and performance middleware setup

### Entry Point

- **`index.js`** - Main configuration export that combines all configurations

## Usage

### In server.js

```javascript
const {
  connectDatabase,
  corsMiddleware,
  helmetMiddleware,
  setupMiddleware,
  setupRoutes,
  setupMonitoring,
} = require('./config');
```

### Individual imports

```javascript
const corsMiddleware = require('./config/cors');
const helmetMiddleware = require('./config/helmet');
```

## Benefits

1. **Modularity** - Each configuration is isolated and focused
2. **Maintainability** - Easy to find and modify specific configurations
3. **Testability** - Individual configurations can be tested separately
4. **Reusability** - Configurations can be reused across different parts of the application
5. **Clean Code** - Server.js is now much cleaner and easier to read

## Adding New Configurations

To add a new configuration:

1. Create a new file in the `config/` directory
2. Export your configuration function or object
3. Add it to the exports in `config/index.js`
4. Import and use it in your application

Example:

```javascript
// config/newFeature.js
const setupNewFeature = app => {
  // Your configuration logic here
};

module.exports = setupNewFeature;

// config/index.js
module.exports = {
  // ... existing exports
  setupNewFeature: require('./newFeature'),
};
```
