const MerchConfigService = require('../services/merchConfigService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get merch config (public endpoint)
 */
async function getMerchConfig(req, res, next) {
  try {
    const merchConfig = await MerchConfigService.getMerchConfig();
    res.json({
      success: true,
      data: merchConfig,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch merch config:', error);
    next(error);
  }
}

/**
 * Get merch config for admin
 */
async function getMerchConfigAdmin(req, res, next) {
  try {
    const merchConfig = await MerchConfigService.getMerchConfigAdmin();
    res.json({
      success: true,
      data: merchConfig,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch merch config admin:', error);
    next(error);
  }
}

/**
 * Create or update merch config
 */
async function updateMerchConfig(req, res, next) {
  try {
    const configData = req.body;
    const result = await MerchConfigService.updateMerchConfig(configData);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to update merch config:', error);
    next(error);
  }
}

/**
 * Delete merch config
 */
async function deleteMerchConfig(req, res, next) {
  try {
    const result = await MerchConfigService.deleteMerchConfig();
    res.json({
      success: true,
      message: 'Merch config deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    logger.error('❌ Failed to delete merch config:', error);
    next(error);
  }
}

module.exports = {
  getMerchConfig,
  getMerchConfigAdmin,
  updateMerchConfig,
  deleteMerchConfig,
};
