/**
 * Validation utilities index
 * Centralized exports for all validation functions
 */

// Core validation functions
const { validateEmail, validatePhoneNumber } = require('./validation');

// Password validation functions
const {
  validatePassword,
  validatePasswordDetailed,
} = require('./passwordValidation');

// Merch config validation
const { validateMerchConfig } = require('./merchConfigValidation');

// Spotify validation
const { validateSpotifyUrl } = require('./spotifyValidation');

// Video validation
const {
  validateVideoCategory,
  getCategoryDescription,
  getCategoryDisplayName,
} = require('./videoValidation');

module.exports = {
  // Core validation
  validateEmail,
  validatePhoneNumber,

  // Password validation
  validatePassword,
  validatePasswordDetailed,

  // Merch config validation
  validateMerchConfig,

  // Spotify validation
  validateSpotifyUrl,

  // Video validation
  validateVideoCategory,
  getCategoryDescription,
  getCategoryDisplayName,
};
