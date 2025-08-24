const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');

const SECRET = process.env.ENCRYPTION_KEY;

/**
 * Hashes a password using bcrypt to ensure passwords are not stored in plain text
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A hashed version of the password.
 */
async function generatePasswordHash(password) {
  try {
    const saltRounds = 12; // Increase security
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    throw new AppError(error?.message || 'Error hashing password', 500);
  }
}

/**
 * Hashes a given value using SHA-256.
 * Optionally normalizes emails (lowercase) before hashing.
 * @param {string} value - The value to be hashed.
 * @param {boolean} normalize - If true, converts value to lowercase (useful for emails).
 * @returns {string} Hashed string or 'unknown' if the value is empty.
 */
function hashValue(value, normalize = false) {
  try {
    if (!value) return 'unknown';
    const input = normalize ? value.toLowerCase() : value;
    return crypto.createHash('sha256').update(input).digest('hex');
  } catch (error) {
    throw new AppError(error?.message || 'Error hashing value', 500);
  }
}

/**
 * Hashes data using SHA-256 and secret key
 * @param {string} data - The data to hash.
 * @returns {string} A hashed string.
 */
function generateHMACSignature(data) {
  if (!SECRET) {
    throw new AppError('ENCRYPTION_KEY is required', 500);
  }

  return crypto.createHmac('sha256', SECRET).update(data).digest('hex');
}

module.exports = {
  generatePasswordHash,
  hashValue,
  generateHMACSignature,
};
