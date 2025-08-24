const MerchConfig = require('../models/MerchConfig');
const logger = require('../utils/logger');

class MerchConfigService {
  /**
   * Get merch config (public endpoint - only returns valid configs)
   */
  async getMerchConfig() {
    try {
      const merchConfig = await MerchConfig.findOne();

      if (!merchConfig) {
        return null;
      }

      // Check if the configuration is valid for the selected store type
      let isValid = false;

      if (merchConfig.storeType === 'shopify') {
        isValid =
          merchConfig.shopDomain &&
          merchConfig.storefrontAccessToken &&
          merchConfig.collectionId;
      } else if (merchConfig.storeType === 'stripe') {
        // For Stripe, we need both publishable key and at least one valid buy button ID
        const hasValidPublishableKey =
          merchConfig.publishableKey &&
          typeof merchConfig.publishableKey === 'string' &&
          merchConfig.publishableKey.trim() !== '';

        const hasValidBuyButtonIds =
          merchConfig.paymentLinkIds &&
          Array.isArray(merchConfig.paymentLinkIds) &&
          merchConfig.paymentLinkIds.length > 0 &&
          merchConfig.paymentLinkIds.some(
            id => id && typeof id === 'string' && id.trim() !== ''
          );

        isValid = hasValidPublishableKey && hasValidBuyButtonIds;
      } else if (merchConfig.storeType === 'external') {
        // External stores can have empty URLs - they just won't be accessible
        isValid = true;
      }

      // Only return the config if it's valid
      if (!isValid && merchConfig.storeType === 'stripe') {
        logger.warn('Stripe config validation failed:', {
          hasValidPublishableKey:
            merchConfig.publishableKey &&
            typeof merchConfig.publishableKey === 'string' &&
            merchConfig.publishableKey.trim() !== '',
          hasValidBuyButtonIds:
            merchConfig.paymentLinkIds &&
            Array.isArray(merchConfig.paymentLinkIds) &&
            merchConfig.paymentLinkIds.length > 0 &&
            merchConfig.paymentLinkIds.some(
              id => id && typeof id === 'string' && id.trim() !== ''
            ),
          publishableKey: merchConfig.publishableKey,
          paymentLinkIds: merchConfig.paymentLinkIds,
        });
      }

      return isValid ? merchConfig : null;
    } catch (error) {
      logger.error('MerchConfig API error:', error);
      throw error;
    }
  }

  /**
   * Get merch config for admin (returns all configs)
   */
  async getMerchConfigAdmin() {
    try {
      const merchConfig = await MerchConfig.findOne();
      return merchConfig || null;
    } catch (error) {
      logger.error('MerchConfig admin API error:', error);
      throw error;
    }
  }

  /**
   * Create or update merch config
   */
  async updateMerchConfig(configData) {
    try {
      if (!configData) {
        throw new Error('Merch config data is required');
      }

      // Allow store type changes without validation
      // Users can switch between types freely and save incomplete configurations

      let merchConfig = await MerchConfig.findOne();

      if (merchConfig) {
        // Update existing config
        Object.assign(merchConfig, configData);
        await merchConfig.save();
        logger.info('Merch config updated successfully');
      } else {
        // Create new config
        merchConfig = await MerchConfig.create(configData);
        logger.info('New merch config created successfully');
      }

      return merchConfig;
    } catch (error) {
      logger.error('MerchConfig update error:', error);
      throw error;
    }
  }

  /**
   * Delete merch config
   */
  async deleteMerchConfig() {
    try {
      const result = await MerchConfig.deleteMany({});

      if (result.deletedCount > 0) {
        logger.info('Merch config deleted successfully');
      }

      return result;
    } catch (error) {
      logger.error('MerchConfig delete error:', error);
      throw error;
    }
  }
}

module.exports = new MerchConfigService();
