// Service to validate Stripe configuration by checking format and syntax
export const validateStripeConfig = (publishableKey, buyButtonIds) => {
  const errors = [];

  // Validate publishable key
  if (
    !publishableKey.startsWith('pk_test_') &&
    !publishableKey.startsWith('pk_live_')
  ) {
    errors.push({
      code: 'INVALID_PUBLISHABLE_KEY_FORMAT',
      message: 'Publishable key must start with pk_test_ or pk_live_',
    });
  }

  // Validate buy button IDs
  // Check for empty entries
  const emptyIds = buyButtonIds.filter(id => !id || id.trim() === '');
  if (emptyIds.length > 0) {
    errors.push({
      code: 'EMPTY_BUY_BUTTON_IDS',
      message: 'Some buy button ID fields are empty',
    });
  }

  // Check format of non-empty IDs
  const invalidIds = buyButtonIds.filter(
    id => id && id.trim() !== '' && !id.startsWith('buy_btn_')
  );
  if (invalidIds.length > 0) {
    errors.push({
      code: 'INVALID_BUY_BUTTON_ID_FORMAT',
      message: 'Buy button IDs must start with buy_btn_',
    });
  }

  // Check for mixed environment (if we have both key and IDs)
  if (publishableKey && buyButtonIds && buyButtonIds.length > 0) {
    const isTestKey = publishableKey.startsWith('pk_test_');
    const isLiveKey = publishableKey.startsWith('pk_live_');

    // Note: We can't actually validate if buy button IDs are test/live
    // This is just a warning to remind users to check
    // In a future enhancement, we could make API calls to validate this
  }

  return {
    success: errors.length === 0,
    errors: errors,
    data: {
      publishableKey: publishableKey,
      buyButtonIds: buyButtonIds,
      totalBuyButtons: buyButtonIds ? buyButtonIds.length : 0,
    },
  };
};

// Helper function to check if Stripe config is complete
export const isStripeConfigComplete = merchConfig => {
  return (
    merchConfig?.storeType === 'STRIPE' &&
    merchConfig?.publishableKey &&
    merchConfig?.paymentLinkIds &&
    merchConfig?.paymentLinkIds.length > 0
  );
};
