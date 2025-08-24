const merchConfigService = require('../services/merchConfigService');
const { AppError } = require('../middleware/errorHandler');

class MerchConfigController {
  /**
   * Get merch config (public endpoint)
   */
  async getMerchConfig(req, res, next) {
    try {
      const merchConfig = await merchConfigService.getMerchConfig();
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
  async getMerchConfigAdmin(req, res, next) {
    try {
      const merchConfig = await merchConfigService.getMerchConfigAdmin();
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
  async updateMerchConfig(req, res, next) {
    try {
      const configData = req.body;
      const result = await merchConfigService.updateMerchConfig(configData);
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
  async deleteMerchConfig(req, res, next) {
    try {
      const result = await merchConfigService.deleteMerchConfig();
      res.json({
        success: true,
        message: 'Merch config deleted successfully',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      next(new AppError('Failed to delete merch config', 500));
    }
  }
}

module.exports = new MerchConfigController();
