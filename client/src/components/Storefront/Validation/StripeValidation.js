import React, { useState, useEffect } from 'react';
import StripeAlert from '../Alerts/StripeAlert';
import {
  validateStripeConfig,
  isStripeConfigComplete,
} from '../../../utils/validation';

// Stripe validation component for admin use
const StripeValidation = ({ merchConfig, forceValidation = false }) => {
  const [validationResult, setValidationResult] = useState(null);

  // Validate Stripe config when it changes or when forced
  useEffect(() => {
    const validateConfig = () => {
      // Only validate if Stripe config is complete
      if (!isStripeConfigComplete(merchConfig)) {
        setValidationResult(null);
        return;
      }

      try {
        const result = validateStripeConfig(
          merchConfig.publishableKey,
          merchConfig.paymentLinkIds
        );

        setValidationResult(result);
      } catch (error) {
        setValidationResult({
          success: false,
          errors: [
            {
              code: 'VALIDATION_ERROR',
              message: error.message,
            },
          ],
        });
      }
    };

    // If forceValidation is true, validate immediately
    if (forceValidation) {
      validateConfig();
    } else {
      // Add a small delay to avoid too many validations
      const timeoutId = setTimeout(validateConfig, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [merchConfig, forceValidation]);

  // Don't render anything if config is not complete or validation was successful
  if (
    !isStripeConfigComplete(merchConfig) ||
    !validationResult ||
    validationResult.success
  ) {
    return null;
  }

  // Show the first error (we could show multiple in the future)
  const firstError = validationResult.errors[0];

  return (
    <div className='stripe-validation mt-3'>
      <StripeAlert error={firstError} />
    </div>
  );
};

export default StripeValidation;
