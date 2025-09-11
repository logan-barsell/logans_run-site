const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const { withTenant } = require('../db/withTenant');
const { validateMerchConfig } = require('../utils/validation');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Merch config allowed fields
const MERCH_CONFIG_FIELDS = [
  'storeType',
  'shopDomain',
  'storefrontAccessToken',
  'collectionId',
  'paymentLinkIds',
  'publishableKey',
  'storefrontUrl',
];

async function getMerchConfig(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const merchConfig = await tx.merchConfig.findUnique({
        where: { tenantId },
      });
      if (!merchConfig) return null;

      const { isValid, details } = validateMerchConfig(merchConfig);
      if (!isValid && merchConfig.storeType === 'stripe') {
        logger.warn('Stripe config validation failed:', details);
      }
      return isValid ? merchConfig : null;
    });
  } catch (error) {
    logger.error('❌ Error fetching merch config:', error);
    throw new AppError(
      error.message || 'Error fetching merch config',
      error.statusCode || 500
    );
  }
}

async function getMerchConfigAdmin(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const merchConfig = await tx.merchConfig.findUnique({
        where: { tenantId },
      });
      if (!merchConfig) return null;

      const { isValid, details } = validateMerchConfig(merchConfig);
      return { ...merchConfig, isValid, details };
    });
  } catch (error) {
    logger.error('❌ Error fetching merch config (admin):', error);
    throw new AppError(
      error.message || 'Error fetching merch config',
      error.statusCode || 500
    );
  }
}

async function updateMerchConfig(tenantId, configData) {
  try {
    if (!configData || Object.keys(configData).length === 0) {
      throw new AppError('Merch config data is required', 400);
    }

    const data = whitelistFields(configData, MERCH_CONFIG_FIELDS);

    return await withTenant(tenantId, async tx => {
      const existing = await tx.merchConfig.findUnique({ where: { tenantId } });
      if (!existing)
        throw new AppError('Merch config does not exist for tenant', 404);
      const updated = await tx.merchConfig.update({
        where: { tenantId },
        data,
      });
      logger.info('✅ Merch config updated successfully');
      return updated;
    });
  } catch (error) {
    logger.error('❌ Error updating merch config:', error);
    throw new AppError(
      error.message || 'Error updating merch config',
      error.statusCode || 500
    );
  }
}

async function deleteMerchConfig(tenantId) {
  try {
    return await withTenant(tenantId, async tx => {
      const existing = await tx.merchConfig.findUnique({ where: { tenantId } });
      if (!existing) return { deletedCount: 0 };
      await tx.merchConfig.delete({ where: { tenantId } });
      logger.info('✅ Merch config deleted successfully');
      return { deletedCount: 1 };
    });
  } catch (error) {
    logger.error('❌ Error deleting merch config:', error);
    throw new AppError(
      error.message || 'Error deleting merch config',
      error.statusCode || 500
    );
  }
}

module.exports = {
  getMerchConfig,
  getMerchConfigAdmin,
  updateMerchConfig,
  deleteMerchConfig,
};
