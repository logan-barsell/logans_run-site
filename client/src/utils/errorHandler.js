// Error handling utility for services
export const handleServiceError = (error, customMessage = null) => {
  let message = customMessage;

  // If no custom message provided, try to extract from error
  if (!message) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      if (data && data.message) {
        message = data.message;
      } else if (data && data.error) {
        message = data.error;
      } else {
        // Fallback messages based on status codes
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
            message = 'Server error. Please try again later.';
            break;
          case 502:
            message = 'Bad gateway. The server is temporarily unavailable.';
            break;
          case 503:
            message = 'Service unavailable. Please try again later.';
            break;
          case 504:
            message = 'Gateway timeout. The server took too long to respond.';
            break;
          default:
            message = 'An unexpected error occurred. Please try again.';
        }
      }
    } else if (error.request) {
      // Network error - no response received
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
      // Other error with message
      message = error.message;
    } else {
      // Fallback for unknown errors
      message = 'An unexpected error occurred. Please try again.';
    }
  }

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Service Error:', {
      error,
      message,
      customMessage,
      timestamp: new Date().toISOString(),
    });
  }

  return {
    message,
    error,
  };
};
