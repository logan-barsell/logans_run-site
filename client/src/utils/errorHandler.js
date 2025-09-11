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

// Helper functions for error display
const getErrorSeverity = (errorType, isCritical = false) => {
  if (isCritical) {
    return 'danger';
  }
  switch (errorType) {
    case ERROR_TYPES.VALIDATION:
    case ERROR_TYPES.CLIENT:
      return 'warning';
    case ERROR_TYPES.AUTHENTICATION:
    case ERROR_TYPES.AUTHORIZATION:
    case ERROR_TYPES.NETWORK:
    case ERROR_TYPES.SERVER:
    case ERROR_TYPES.UNKNOWN:
    default:
      return 'danger';
  }
};

const getErrorTitle = errorType => {
  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      return 'Network Error:';
    case ERROR_TYPES.SERVER:
      return 'Server Error:';
    case ERROR_TYPES.AUTHENTICATION:
      return 'Authentication Error:';
    case ERROR_TYPES.AUTHORIZATION:
      return 'Authorization Error:';
    case ERROR_TYPES.VALIDATION:
      return 'Validation Error:';
    case ERROR_TYPES.CLIENT:
      return 'Client Error:';
    case ERROR_TYPES.UNKNOWN:
    default:
      return 'Error:';
  }
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

  // Always classify error type based on response status if available
  if (error.response) {
    const status = error.response.status;
    statusCode = status;

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

    // If no custom message provided, try to extract from error response
    if (!message) {
      const data = error.response.data;
      let backendMessage = null;

      if (data && data.message) {
        backendMessage = data.message;
      } else if (data && data.error) {
        backendMessage = data.error;
      } else if (typeof data === 'string') {
        backendMessage = data;
      }

      if (backendMessage) {
        message = backendMessage;
      } else {
        // Use generic fallback messages based on status
        switch (status) {
          case 400:
            message = 'Invalid request. Please check your input and try again.';
            break;
          case 401:
            message = 'You are not authorized to perform this action.';
            break;
          case 403:
            message =
              'Access forbidden. You do not have permission for this action.';
            break;
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 409:
            message =
              'This resource already exists or conflicts with existing data.';
            break;
          case 422:
            message = 'Validation error. Please check your input.';
            break;
          case 429:
            message = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
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
            message = 'An unexpected error occurred. Please try again.';
        }
      }
    }
  } else if (error.request) {
    // Network error - no response received
    // Check if this is a timeout error (which should be treated as server error)
    if (
      error.code === 'ECONNABORTED' ||
      (error.message && error.message.includes('timeout')) ||
      (error.message && error.message.includes('504'))
    ) {
      errorType = ERROR_TYPES.SERVER;
      message = 'Request timed out. The server took too long to respond.';
    } else if (error.message && error.message.includes('Network Error')) {
      errorType = ERROR_TYPES.NETWORK;
      message = 'Network error. Please check your internet connection.';
    } else {
      errorType = ERROR_TYPES.NETWORK;
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
    console.error('Original Error Object:', error);
  }

  return {
    message,
    errorType,
    statusCode,
    severity: getErrorSeverity(errorType),
    title: getErrorTitle(errorType),
    context: errorContext,
  };
};
