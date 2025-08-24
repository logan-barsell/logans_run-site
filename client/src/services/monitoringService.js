import { handleServiceError } from '../utils/errorHandler';

class MonitoringService {
  constructor() {
    this.errors = [];
    this.performance = {};
    this.isInitialized = false;
  }

  /**
   * Initialize monitoring
   */
  init() {
    if (this.isInitialized) return;

    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.setupNetworkMonitoring();

    this.isInitialized = true;
    console.log('🔍 Monitoring service initialized');
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', event => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle React errors (if using React Error Boundary)
    if (window.React && window.React.Component) {
      const originalComponentDidCatch =
        window.React.Component.prototype.componentDidCatch;
      window.React.Component.prototype.componentDidCatch = function (
        error,
        errorInfo
      ) {
        this.logError('React Error', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });

        if (originalComponentDidCatch) {
          originalComponentDidCatch.call(this, error, errorInfo);
        }
      };
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          this.logPerformance('Page Load', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded:
              perfData.domContentLoadedEventEnd -
              perfData.domContentLoadedEventStart,
            firstPaint:
              performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName(
              'first-contentful-paint'
            )[0]?.startTime,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          });
        }
      }, 0);
    });

    // Monitor API response times
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        this.logPerformance('API Request', {
          url: args[0],
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          status: response.status,
          timestamp: new Date().toISOString(),
        });

        return response;
      } catch (error) {
        const endTime = performance.now();

        this.logError('API Request Failed', {
          url: args[0],
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        throw error;
      }
    };
  }

  /**
   * Setup network monitoring
   */
  setupNetworkMonitoring() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.logEvent('Network Status', { status: 'online' });
    });

    window.addEventListener('offline', () => {
      this.logEvent('Network Status', { status: 'offline' });
    });

    // Monitor connection quality
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.logEvent('Connection Change', {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
        });
      });
    }
  }

  /**
   * Log an error
   */
  logError(type, data) {
    const error = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    this.errors.push(error);

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 Error logged:', error);
    }

    // Send to server in production
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToServer(error);
    }
  }

  /**
   * Log performance data
   */
  logPerformance(type, data) {
    const perf = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    this.performance[type] = perf;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance logged:', perf);
    }

    // Send to server in production
    if (process.env.NODE_ENV === 'production') {
      this.sendPerformanceToServer(perf);
    }
  }

  /**
   * Log an event
   */
  logEvent(type, data) {
    const event = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Event logged:', event);
    }

    // Send to server in production
    if (process.env.NODE_ENV === 'production') {
      this.sendEventToServer(event);
    }
  }

  /**
   * Send error to server
   */
  async sendErrorToServer(error) {
    try {
      await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (err) {
      console.warn('Failed to send error to server:', err);
    }
  }

  /**
   * Send performance data to server
   */
  async sendPerformanceToServer(perf) {
    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perf),
      });
    } catch (err) {
      console.warn('Failed to send performance data to server:', err);
    }
  }

  /**
   * Send event to server
   */
  async sendEventToServer(event) {
    try {
      await fetch('/api/monitoring/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (err) {
      console.warn('Failed to send event to server:', err);
    }
  }

  /**
   * Get monitoring data
   */
  getData() {
    return {
      errors: this.errors,
      performance: this.performance,
      isInitialized: this.isInitialized,
    };
  }

  /**
   * Clear monitoring data
   */
  clear() {
    this.errors = [];
    this.performance = {};
  }
}

// Export singleton instance
export default new MonitoringService();
