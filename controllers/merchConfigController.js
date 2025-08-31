const MerchConfigService = require('../services/merchConfigService');
const { AppError } = require('../middleware/errorHandler');

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
    next(new AppError('Failed to fetch merch config', 500));
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
    next(new AppError('Failed to fetch merch config', 500));
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
    if (error.message === 'Merch config data is required') {
      return next(new AppError('Merch config data is required', 400));
    }
    next(new AppError('Failed to update merch config', 500));
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
    next(new AppError('Failed to delete merch config', 500));
  }
}

module.exports = {
  getMerchConfig,
  getMerchConfigAdmin,
  updateMerchConfig,
  deleteMerchConfig,
};
