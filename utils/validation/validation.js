/**
 * Validation utilities for user input
 */

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
  validatePhoneNumber,
};
