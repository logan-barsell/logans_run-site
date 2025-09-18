const TwoFactorService = require('../services/twoFactorService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Send 2FA code to user's email
 * Can be called with or without authentication:
 * - With auth: uses req.user.id and req.tenantId (for authenticated users managing 2FA)
 * - Without auth: uses req.body.userId and req.body.tenantId (for login process)
 */
async function sendCode(req, res, next) {
  try {
    // Determine userId and tenantId based on whether user is authenticated
    const userId = req.user?.id || req.body.userId;
    const tenantId = req.tenantId || req.body.tenantId;
    const bandName = 'Bandsyte'; // Default fallback, should be retrieved from theme.siteTitle in production

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: 'Tenant ID is required',
      });
    }

    const result = await TwoFactorService.sendTwoFactorCode(
      tenantId,
      userId,
      bandName
    );

    res.status(200).json({
      success: true,
      message: result.message,
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    logger.error('Error in sendCode controller:', error);
    next(error);
  }
}

/**
 * Verify 2FA code
 */
async function verifyCode(req, res, next) {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      throw new AppError('Verification code is required', 400);
    }

    const result = await TwoFactorService.verifyTwoFactorCode(
      req.tenantId,
      userId,
      code
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error in verifyCode controller:', error);
    next(error);
  }
}

/**
 * Enable 2FA for user
 */
async function enableTwoFactorController(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await TwoFactorService.enableTwoFactor(req.tenantId, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error in enableTwoFactor controller:', error);
    next(error);
  }
}

/**
 * Disable 2FA for user
 */
async function disableTwoFactorController(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await TwoFactorService.disableTwoFactor(
      req.tenantId,
      userId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error in disableTwoFactor controller:', error);
    next(error);
  }
}

/**
 * Get 2FA status for user
 */
async function getTwoFactorStatus(req, res, next) {
  try {
    const userId = req.user.id;
    const isEnabled = await TwoFactorService.isTwoFactorEnabled(
      req.tenantId,
      userId
    );

    res.status(200).json({
      success: true,
      twoFactorEnabled: isEnabled,
    });
  } catch (error) {
    logger.error('Error in getTwoFactorStatus controller:', error);
    next(error);
  }
}

module.exports = {
  sendCode,
  verifyCode,
  enableTwoFactor: enableTwoFactorController,
  disableTwoFactor: disableTwoFactorController,
  getTwoFactorStatus,
};
