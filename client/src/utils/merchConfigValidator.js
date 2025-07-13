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
  // External stores can have empty URLs - they just won't show the nav link
  return true;
};

/**
 * Checks if a merch config should show the Store nav link
 */
export const shouldShowStoreNav = merchConfig => {
  if (!merchConfig) {
    return false;
  }

  // For external stores, we need a valid URL to show the nav link
  if (merchConfig.storeType === 'external') {
    return !!(
      merchConfig.storefrontUrl && merchConfig.storefrontUrl.trim() !== ''
    );
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
