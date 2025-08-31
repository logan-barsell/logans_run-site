const TwoFactorService = require('../services/twoFactorService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Send 2FA code to user's email
 */
async function sendCode(req, res, next) {
  try {
    const userId = req.user._id.toString();
    const bandName = req.body.bandName || 'Bandsyte';

    const result = await TwoFactorService.sendTwoFactorCode(userId, bandName);

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
    const userId = req.user._id.toString();
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required',
      });
    }

    const result = await TwoFactorService.verifyTwoFactorCode(userId, code);

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
    const userId = req.user._id.toString();

    const result = await TwoFactorService.enableTwoFactor(userId);

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
    const userId = req.user._id.toString();

    const result = await TwoFactorService.disableTwoFactor(userId);

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
    const userId = req.user._id.toString();
    const isEnabled = await TwoFactorService.isTwoFactorEnabled(userId);

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
