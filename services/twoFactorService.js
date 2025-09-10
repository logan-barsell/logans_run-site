const BandsyteEmailService = require('./bandsyteEmailService');
const { addMinutes } = require('../utils/dates');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');

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
async function sendTwoFactorCode(tenantId, userId, bandName = 'Bandsyte') {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.findUnique({ where: { id: userId } })
    );
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
    await withTenant(tenantId, async tx =>
      tx.user.update({
        where: { id: userId },
        data: { twoFactorCode: code, twoFactorCodeExpiry: expiryTime },
      })
    );

    // Send email
    await BandsyteEmailService.sendTwoFactorCodeWithBranding(
      user.adminEmail,
      code,
      bandName,
      tenantId
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
async function verifyTwoFactorCode(tenantId, userId, code) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.findUnique({ where: { id: userId } })
    );
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.twoFactorEnabled) {
      throw new AppError('Two-factor authentication is not enabled', 400);
    }

    // Check if code is valid and not expired
    const now = new Date();
    const expiryDate = new Date(user.twoFactorCodeExpiry);
    const isValid =
      user.twoFactorCode && user.twoFactorCodeExpiry && expiryDate > now;

    if (!isValid)
      throw new AppError('Verification code has expired or is invalid', 400);

    // Check if code matches
    if (user.twoFactorCode !== code) {
      throw new AppError('Invalid verification code', 400);
    }

    // Clear the code after successful verification
    await withTenant(tenantId, async tx =>
      tx.user.update({
        where: { id: userId },
        data: { twoFactorCode: null, twoFactorCodeExpiry: null },
      })
    );

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
async function enableTwoFactor(tenantId, userId) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true },
      })
    );
    if (!user) throw new AppError('User not found', 404);

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
async function disableTwoFactor(tenantId, userId) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorCode: null,
          twoFactorCodeExpiry: null,
        },
      })
    );
    if (!user) throw new AppError('User not found', 404);

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
async function isTwoFactorEnabled(tenantId, userId) {
  try {
    const user = await withTenant(tenantId, async tx =>
      tx.user.findUnique({ where: { id: userId } })
    );
    return user ? !!user.twoFactorEnabled : false;
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
