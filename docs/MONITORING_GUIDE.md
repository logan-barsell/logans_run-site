# Monitoring Guide

## Overview

This application includes comprehensive monitoring capabilities for both backend and frontend performance, error tracking, and system health.

## Backend Monitoring

### Health Checks

- **Basic Health Check**: `GET /api/health`

  - Returns basic system status
  - Used by load balancers and monitoring tools

- **Detailed Health Check**: `GET /api/health/detailed`

  - Returns comprehensive system information
  - Includes database status, memory usage, system info

- **Metrics Endpoint**: `GET /api/metrics`
  - Returns raw metrics for external monitoring systems
  - Compatible with Prometheus, Grafana, etc.

### Real-Time Dashboard

- **Status Monitor**: `GET /status`
  - Real-time performance dashboard
  - Shows CPU, memory, response times, request rates
  - Interactive charts and graphs

### Request Logging

- **Morgan Integration**: All HTTP requests are logged
- **Winston Integration**: Structured logging with rotation
- **Error Tracking**: Automatic error capture and logging

## Frontend Monitoring

### Error Tracking

- **JavaScript Errors**: Automatic capture of JS errors
- **Promise Rejections**: Unhandled promise rejection tracking
- **React Errors**: Component error boundary integration
- **API Errors**: Failed API request tracking

### Performance Monitoring

- **Page Load Times**: Navigation timing API integration
- **API Response Times**: Automatic fetch interception
- **Core Web Vitals**: First Paint, First Contentful Paint
- **Network Status**: Online/offline and connection quality

### Event Tracking

- **Network Events**: Connection changes, online/offline
- **Custom Events**: Application-specific events
- **User Interactions**: Click tracking, form submissions

## Configuration

### Environment Variables

```bash
# Monitoring Configuration
NODE_ENV=development|production
LOG_LEVEL=error|warn|info|debug
```

### Development vs Production

**Development Mode:**

- CSRF protection disabled
- Detailed error logging
- Console output for debugging
- Performance data logged to console

**Production Mode:**

- CSRF protection enabled
- Error data sent to server
- Performance data sent to server
- Minimal console output

## Usage

### Accessing Monitoring Data

1. **Health Check**: Visit `http://localhost:5001/api/health`
2. **Dashboard**: Visit `http://localhost:5001/status`
3. **Detailed Health**: Visit `http://localhost:5001/api/health/detailed`

### Frontend Monitoring

The monitoring service is automatically initialized when the app loads. You can access monitoring data programmatically:

```javascript
import monitoringService from './services/monitoringService';

// Get all monitoring data
const data = monitoringService.getData();

// Log a custom event
monitoringService.logEvent('User Action', { action: 'button_click' });

// Log a custom error
monitoringService.logError('Custom Error', { message: 'Something went wrong' });
```

### Custom Health Checks

Add custom health checks to the monitoring middleware:

```javascript
// In middleware/monitoring.js
const customHealthCheck = async (req, res) => {
  // Add your custom health check logic
  const externalServiceStatus = await checkExternalService();

  res.json({
    success: true,
    data: {
      externalService: externalServiceStatus,
      // ... other checks
    },
  });
};
```

## Integration with External Tools

### Prometheus/Grafana

The metrics endpoint (`/api/metrics`) provides data in a format compatible with Prometheus:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'logans-run-api'
    static_configs:
      - targets: ['localhost:5001']
    metrics_path: '/api/metrics'
```

### Log Aggregation

Logs are written to the `logs/` directory with daily rotation. Integrate with tools like:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **Datadog**
- **New Relic**

### Error Tracking

For production error tracking, consider integrating with:

- **Sentry**
- **Bugsnag**
- **Rollbar**
- **LogRocket**

## Best Practices

1. **Monitor Key Metrics**:

   - Response times
   - Error rates
   - Memory usage
   - Database connection status

2. **Set Up Alerts**:

   - High error rates
   - Slow response times
   - Memory leaks
   - Database disconnections

3. **Regular Health Checks**:

   - Automated health check monitoring
   - Uptime monitoring
   - Performance baseline tracking

4. **Log Management**:
   - Regular log rotation
   - Log level configuration
   - Structured logging
   - Error correlation

## Troubleshooting

### Common Issues

1. **Dashboard Not Loading**:

   - Check if express-status-monitor is properly configured
   - Verify the `/status` route is accessible

2. **Health Check Failing**:

   - Check database connection
   - Verify all required services are running
   - Check memory usage

3. **Frontend Monitoring Not Working**:
   - Ensure monitoring service is initialized
   - Check browser console for errors
   - Verify network connectivity

### Debug Mode

Enable debug logging by setting:

```bash
LOG_LEVEL=debug
NODE_ENV=development
```

This will provide detailed logging for troubleshooting monitoring issues.
