const User = require('../models/User');
const EmailService = require('./emailService');
const { addMinutes } = require('../utils/dates');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Generate a 6-digit verification code
 * @returns {string} 6-digit code
 */
function generateTwoFactorCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send 2FA code to user's email
 * @param {string} userId - User ID
 * @param {string} bandName - Band name for email template
 * @returns {Object} Result object
 */
async function sendTwoFactorCode(userId, bandName = 'Bandsyte') {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.twoFactorEnabled) {
      throw new AppError('Two-factor authentication is not enabled', 400);
    }

    // Generate new code
    const code = generateTwoFactorCode();
    const expiryTime = addMinutes(5); // Code expires in 5 minutes

    // Save code to user
    user.twoFactorCode = code;
    user.twoFactorCodeExpiry = expiryTime;
    await user.save();

    // Send email
    await EmailService.sendEmail(
      user.adminEmail,
      null, // Subject will be set by template
      null, // HTML will be set by template
      'twoFactorCode',
      {
        code,
        bandName,
      }
    );

    logger.info(`📧 2FA code sent to user ${user.adminEmail}`);

    return {
      success: true,
      message: 'Verification code sent to your email',
      expiresIn: 5, // minutes
    };
  } catch (error) {
    logger.error('Error sending 2FA code:', error);
    throw error;
  }
}

/**
 * Verify 2FA code
 * @param {string} userId - User ID
 * @param {string} code - Verification code
 * @returns {Object} Result object
 */
async function verifyTwoFactorCode(userId, code) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.twoFactorEnabled) {
      throw new AppError('Two-factor authentication is not enabled', 400);
    }

    // Check if code is valid and not expired
    if (!user.isTwoFactorCodeValid()) {
      throw new AppError('Verification code has expired or is invalid', 400);
    }

    // Check if code matches
    if (user.twoFactorCode !== code) {
      throw new AppError('Invalid verification code', 400);
    }

    // Clear the code after successful verification
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpiry = undefined;
    await user.save();

    logger.info(`✅ 2FA verification successful for user ${user.adminEmail}`);

    return {
      success: true,
      message: 'Verification successful',
    };
  } catch (error) {
    logger.error('Error verifying 2FA code:', error);
    throw error;
  }
}

/**
 * Enable 2FA for a user
 * @param {string} userId - User ID
 * @returns {Object} Result object
 */
async function enableTwoFactor(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.twoFactorEnabled = true;
    await user.save();

    logger.info(`🔐 2FA enabled for user ${user.adminEmail}`);

    return {
      success: true,
      message: 'Two-factor authentication enabled successfully',
    };
  } catch (error) {
    logger.error('Error enabling 2FA:', error);
    throw error;
  }
}

/**
 * Disable 2FA for a user
 * @param {string} userId - User ID
 * @returns {Object} Result object
 */
async function disableTwoFactor(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.twoFactorEnabled = false;
    user.twoFactorCode = undefined;
    user.twoFactorCodeExpiry = undefined;
    await user.save();

    logger.info(`🔓 2FA disabled for user ${user.adminEmail}`);

    return {
      success: true,
      message: 'Two-factor authentication disabled successfully',
    };
  } catch (error) {
    logger.error('Error disabling 2FA:', error);
    throw error;
  }
}

/**
 * Check if user has 2FA enabled
 * @param {string} userId - User ID
 * @returns {boolean} Whether 2FA is enabled
 */
async function isTwoFactorEnabled(userId) {
  try {
    const user = await User.findById(userId);
    return user ? user.twoFactorEnabled : false;
  } catch (error) {
    logger.error('Error checking 2FA status:', error);
    return false;
  }
}

module.exports = {
  generateTwoFactorCode,
  sendTwoFactorCode,
  verifyTwoFactorCode,
  enableTwoFactor,
  disableTwoFactor,
  isTwoFactorEnabled,
};
