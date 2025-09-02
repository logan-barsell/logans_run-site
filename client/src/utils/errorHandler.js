// Error types for better classification and handling
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NETWORK: 'network',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown',
};

// Enhanced error handling utility for services
export const handleServiceError = (error, options = {}) => {
  const {
    operation = 'unknown operation',
    userId = null,
    includeStack = false,
    context = {},
    customMessage = null,
  } = options;

  let message = customMessage;
  let errorType = ERROR_TYPES.UNKNOWN;
  let statusCode = null;

  // If no custom message provided, try to extract from error
  if (!message) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      statusCode = status;
      const data = error.response.data;

      // Try to extract backend message first - this is the most important part
      let backendMessage = null;
      if (data && data.message) {
        backendMessage = data.message;
      } else if (data && data.error) {
        backendMessage = data.error;
      } else if (typeof data === 'string') {
        backendMessage = data;
      }

      // If we have a backend message, use it and classify the error type
      if (backendMessage) {
        message = backendMessage;

        // Classify error type based on status code
        switch (status) {
          case 400:
            errorType = ERROR_TYPES.VALIDATION;
            break;
          case 401:
            errorType = ERROR_TYPES.AUTHENTICATION;
            break;
          case 403:
            errorType = ERROR_TYPES.AUTHORIZATION;
            break;
          case 404:
            errorType = ERROR_TYPES.CLIENT;
            break;
          case 409:
            errorType = ERROR_TYPES.VALIDATION;
            break;
          case 422:
            errorType = ERROR_TYPES.VALIDATION;
            break;
          case 429:
            errorType = ERROR_TYPES.SERVER;
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorType = ERROR_TYPES.SERVER;
            break;
          default:
            errorType = ERROR_TYPES.UNKNOWN;
        }
      } else {
        // No backend message - use generic fallback messages
        switch (status) {
          case 400:
            errorType = ERROR_TYPES.VALIDATION;
            message = 'Invalid request. Please check your input and try again.';
            break;
          case 401:
            errorType = ERROR_TYPES.AUTHENTICATION;
            message = 'You are not authorized to perform this action.';
            break;
          case 403:
            errorType = ERROR_TYPES.AUTHORIZATION;
            message =
              'Access forbidden. You do not have permission for this action.';
            break;
          case 404:
            errorType = ERROR_TYPES.CLIENT;
            message = 'The requested resource was not found.';
            break;
          case 409:
            errorType = ERROR_TYPES.VALIDATION;
            message =
              'This resource already exists or conflicts with existing data.';
            break;
          case 422:
            errorType = ERROR_TYPES.VALIDATION;
            message = 'Validation error. Please check your input.';
            break;
          case 429:
            errorType = ERROR_TYPES.SERVER;
            message = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            errorType = ERROR_TYPES.SERVER;
            message =
              status === 500
                ? 'Server error. Please try again later.'
                : status === 502
                ? 'Bad gateway. The server is temporarily unavailable.'
                : status === 503
                ? 'Service unavailable. Please try again later.'
                : 'Gateway timeout. The server took too long to respond.';
            break;
          default:
            errorType = ERROR_TYPES.UNKNOWN;
            message = 'An unexpected error occurred. Please try again.';
        }
      }
    } else if (error.request) {
      // Network error - no response received
      errorType = ERROR_TYPES.NETWORK;

      if (error.code === 'ECONNABORTED') {
        message =
          'Request timed out. Please check your connection and try again.';
      } else if (error.message && error.message.includes('Network Error')) {
        message = 'Network error. Please check your internet connection.';
      } else {
        message =
          'Unable to connect to the server. Please check your connection.';
      }
    } else if (error.message) {
      // Other error with message (client-side error)
      errorType = ERROR_TYPES.CLIENT;
      message = error.message;
    } else {
      // Fallback for unknown errors
      errorType = ERROR_TYPES.UNKNOWN;
      message = 'An unexpected error occurred. Please try again.';
    }
  }

  // Enhanced logging with more context
  const errorContext = {
    operation,
    errorType,
    statusCode,
    userId,
    message,
    customMessage,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    ...context,
  };

  // Add stack trace in development if requested
  if (includeStack && process.env.NODE_ENV === 'development') {
    errorContext.stack = error.stack;
  }

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Service Error:', errorContext);

    // Log original error separately for detailed inspection
    console.error('Original Error Object:', error);
  }

  return {
    message,
    error,
    errorType,
    statusCode,
    context: errorContext,
  };
};
