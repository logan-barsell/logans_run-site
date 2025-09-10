function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function hasNonEmptyStringInArray(arr) {
  return (
    Array.isArray(arr) && arr.length > 0 && arr.some(id => isNonEmptyString(id))
  );
}

function validateMerchConfig(config) {
  if (!config || typeof config !== 'object') {
    return { isValid: false, details: { reason: 'missing_config' } };
  }

  const { storeType } = config;
  if (storeType === 'shopify') {
    const details = {
      hasShopDomain: isNonEmptyString(config.shopDomain),
      hasStorefrontAccessToken: isNonEmptyString(config.storefrontAccessToken),
      hasCollectionId: isNonEmptyString(config.collectionId),
    };
    const isValid =
      details.hasShopDomain &&
      details.hasStorefrontAccessToken &&
      details.hasCollectionId;
    return { isValid, details };
  }

  if (storeType === 'stripe') {
    const details = {
      hasValidPublishableKey: isNonEmptyString(config.publishableKey),
      hasValidBuyButtonIds: hasNonEmptyStringInArray(config.paymentLinkIds),
    };
    const isValid =
      details.hasValidPublishableKey && details.hasValidBuyButtonIds;
    return { isValid, details };
  }

  if (storeType === 'external') {
    return { isValid: true, details: {} };
  }

  return { isValid: false, details: { reason: 'unknown_store_type' } };
}

module.exports = { validateMerchConfig };
