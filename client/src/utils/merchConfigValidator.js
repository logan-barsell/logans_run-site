/**
 * Validates merch configuration for different store types
 * Matches the validation logic from the backend
 */

export const validateMerchConfig = merchConfig => {
  if (!merchConfig || !merchConfig.storeType) {
    return false;
  }

  switch (merchConfig.storeType) {
    case 'shopify':
      return validateShopifyConfig(merchConfig);
    case 'stripe':
      return validateStripeConfig(merchConfig);
    case 'external':
      return validateExternalConfig(merchConfig);
    default:
      return false;
  }
};

const validateShopifyConfig = config => {
  return !!(
    config.shopDomain &&
    config.storefrontAccessToken &&
    config.collectionId &&
    config.shopDomain.trim() !== '' &&
    config.storefrontAccessToken.trim() !== '' &&
    config.collectionId.trim() !== ''
  );
};

const validateStripeConfig = config => {
  // Check for valid publishable key
  const hasValidPublishableKey =
    config.publishableKey &&
    typeof config.publishableKey === 'string' &&
    config.publishableKey.trim() !== '';

  // Check for valid payment link IDs
  const hasValidPaymentLinkIds =
    config.paymentLinkIds &&
    Array.isArray(config.paymentLinkIds) &&
    config.paymentLinkIds.length > 0 &&
    config.paymentLinkIds.some(
      id => id && typeof id === 'string' && id.trim() !== ''
    );

  return hasValidPublishableKey && hasValidPaymentLinkIds;
};

const validateExternalConfig = config => {
  return !!(config.storefrontUrl && config.storefrontUrl.trim() !== '');
};

/**
 * Checks if a merch config should show the Store nav link
 */
export const shouldShowStoreNav = merchConfig => {
  if (!merchConfig) {
    return false;
  }

  // For external stores, we need a valid URL
  if (merchConfig.storeType === 'external') {
    return validateExternalConfig(merchConfig);
  }

  // For shopify and stripe, validate the full config
  return validateMerchConfig(merchConfig);
};

/**
 * Checks if a merch config should allow access to the /store route
 */
export const shouldAllowStoreAccess = merchConfig => {
  if (!merchConfig) {
    return false;
  }

  // External stores should not reach the /store page
  if (merchConfig.storeType === 'external') {
    return false;
  }

  // For shopify and stripe, validate the full config
  return validateMerchConfig(merchConfig);
};
