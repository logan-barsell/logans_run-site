import React, { useState, useEffect } from 'react';
import ShopifyAlert from '../Alerts/ShopifyAlert';
import {
  validateShopifyConfig,
  isShopifyConfigComplete,
} from '../../../services/shopifyService';

// Shopify validation component for admin use
const ShopifyValidation = ({ merchConfig, forceValidation = false }) => {
  const [validationResult, setValidationResult] = useState(null);

  // Validate Shopify config when it changes or when forced
  useEffect(() => {
    const validateConfig = async () => {
      // Only validate if Shopify config is complete
      if (!isShopifyConfigComplete(merchConfig)) {
        setValidationResult(null);
        return;
      }

      try {
        const result = await validateShopifyConfig(
          merchConfig.shopDomain,
          merchConfig.storefrontAccessToken,
          merchConfig.collectionId
        );

        setValidationResult(result);
      } catch (error) {
        setValidationResult({
          success: false,
          error: {
            message: error.message,
            extensions: { code: 'VALIDATION_ERROR' },
          },
          response: null,
        });
      }
    };

    // If forceValidation is true, validate immediately
    if (forceValidation) {
      validateConfig();
    } else {
      // Add a small delay to avoid too many API calls
      const timeoutId = setTimeout(validateConfig, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [merchConfig, forceValidation]);

  // Don't render anything if config is not complete or validation was successful
  if (
    !isShopifyConfigComplete(merchConfig) ||
    !validationResult ||
    validationResult.success
  ) {
    return null;
  }

  return (
    <div className='shopify-validation mt-1 mb-5'>
      <ShopifyAlert
        error={validationResult.error}
        response={validationResult.response}
      />
    </div>
  );
};

export default ShopifyValidation;
