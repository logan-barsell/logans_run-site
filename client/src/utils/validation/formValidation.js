/**
 * Form Validation Utility
 * Validates common form fields like email, phone, and general URLs
 */

/**
 * Centralized URL validation utility
 * @param {string} url - The URL to validate
 * @param {string} platformName - Name of the platform for error messages
 * @param {Array} patterns - Array of regex patterns to validate against
 * @param {Array} supportedTypes - Array of supported content types (optional)
 * @returns {object} - Validation result with isValid, type, id, and error message
 */
export const validateUrlWithPatterns = (
  url,
  platformName,
  patterns,
  supportedTypes = null
) => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      type: null,
      id: null,
      error: 'URL is required and must be a string',
    };
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return {
      isValid: false,
      type: null,
      id: null,
      error: 'URL cannot be empty',
    };
  }

  // Pre-validation: Check for obvious malformed patterns
  if (
    trimmedUrl.includes('@') ||
    trimmedUrl.includes('://.') ||
    trimmedUrl.includes('://@') ||
    trimmedUrl.startsWith('@')
  ) {
    return {
      isValid: false,
      type: null,
      id: null,
      error: `Please enter a valid ${platformName} URL`,
    };
  }

  // Normalize URL by adding protocol if missing
  let normalizedUrl = trimmedUrl;
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    normalizedUrl = `https://${trimmedUrl}`;
  }

  // Check if it's a valid URL format
  try {
    const urlObj = new URL(normalizedUrl);

    // Additional validation to catch malformed URLs
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return {
        isValid: false,
        type: null,
        id: null,
        error: `Please enter a valid ${platformName} URL with a proper domain name`,
      };
    }

    // Check for common malformed patterns
    if (urlObj.hostname.includes('@') || urlObj.hostname.includes(':')) {
      return {
        isValid: false,
        type: null,
        id: null,
        error: `Please enter a valid ${platformName} URL`,
      };
    }

    // Ensure the hostname has at least one dot (for domain)
    if (!urlObj.hostname.includes('.')) {
      return {
        isValid: false,
        type: null,
        id: null,
        error: `Please enter a valid ${platformName} URL with a proper domain name`,
      };
    }

    // Check for hostnames that start or end with dots
    if (urlObj.hostname.startsWith('.') || urlObj.hostname.endsWith('.')) {
      return {
        isValid: false,
        type: null,
        id: null,
        error: `Please enter a valid ${platformName} URL with a proper domain name`,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      type: null,
      id: null,
      error: `Please enter a valid ${platformName} URL`,
    };
  }

  // Check against provided patterns
  if (patterns && patterns.length > 0) {
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = trimmedUrl.match(pattern);
      if (match) {
        const id = match[1] || null;

        // Check if content type is supported (if supportedTypes provided)
        if (supportedTypes && !supportedTypes.includes(type)) {
          return {
            isValid: false,
            type,
            id,
            error: `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } URLs are not supported for ${platformName}`,
          };
        }

        return {
          isValid: true,
          type,
          id,
          error: null,
        };
      }
    }

    return {
      isValid: false,
      type: null,
      id: null,
      error: `Not a valid ${platformName} URL`,
    };
  }

  // If no patterns provided, just validate URL format
  return {
    isValid: true,
    type: null,
    id: null,
    error: null,
  };
};

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateEmail = email => {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required and must be a string',
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      isValid: false,
      error: 'Email cannot be empty',
    };
  }

  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validates a phone number (US format)
 * @param {string} phone - The phone number to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validatePhone = phone => {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: 'Phone number is required and must be a string',
    };
  }

  const trimmedPhone = phone.trim();

  if (!trimmedPhone) {
    return {
      isValid: false,
      error: 'Phone number cannot be empty',
    };
  }

  // Remove all non-digit characters for validation
  const digitsOnly = trimmedPhone.replace(/\D/g, '');

  // Check if it's a valid 10-digit US phone number
  if (digitsOnly.length !== 10) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit US phone number',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Normalizes a phone number to (XXX) XXX-XXXX format
 * @param {string} phone - The phone number to normalize
 * @returns {string} - Normalized phone number
 */
export const normalizePhone = phone => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(
      3,
      6
    )}-${digitsOnly.slice(6)}`;
  }

  // Return original if not 10 digits
  return phone;
};

/**
 * Validates a general URL
 * @param {string} url - The URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateUrl = url => {
  const result = validateUrlWithPatterns(url, 'URL');
  return {
    isValid: result.isValid,
    error: result.error,
  };
};
