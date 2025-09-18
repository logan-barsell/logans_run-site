/**
 * Validates password strength (simple regex check)
 * @param {string} password - The password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validates password strength with detailed error messages
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
const validatePasswordDetailed = password => {
  const errors = [];

  if (!password) {
    return { isValid: false, errors: ['Password is required'] };
  }

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Maximum length (prevent DoS attacks)
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(
      'Password must contain at least one special character (!@#$%^&*...)'
    );
  }

  // Check for common weak patterns
  const weakPatterns = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'football',
  ];

  const lowerPassword = password.toLowerCase();
  if (weakPatterns.some(pattern => lowerPassword.includes(pattern))) {
    errors.push('Password contains common weak patterns');
  }

  // Check for repeated characters (more than 3 in a row)
  if (/(.)\1{3,}/.test(password)) {
    errors.push(
      'Password cannot contain more than 3 repeated characters in a row'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validatePassword,
  validatePasswordDetailed,
};
