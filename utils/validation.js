/**
 * Validation utilities for user input
 */

const {
  validatePassword: detailedValidate,
} = require('./validation/passwordValidation');

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
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
 * @param {string} password - The password to validate
 * @returns {Object} - Validation result with isValid and errors array
 */
function validatePasswordDetailed(password) {
  return detailedValidate(password);
}

/**
 * Validates US phone number format (digits only)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePhoneNumber(phone) {
  // This regex matches US phone numbers with only digits
  const usPhoneRegex = /^1?\d{10}$/;
  return usPhoneRegex.test(phone);
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePasswordDetailed,
  validatePhoneNumber,
};
