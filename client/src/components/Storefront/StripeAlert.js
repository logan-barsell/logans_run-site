import React from 'react';
import StaticAlert from '../Alert/StaticAlert';

const StripeAlert = ({ error }) => {
  // If no error, don't render anything
  if (!error) {
    return null;
  }

  // Parse different types of Stripe validation errors
  const parseStripeError = () => {
    const errorCode = error?.code || 'UNKNOWN_ERROR';

    switch (errorCode) {
      case 'MISSING_PUBLISHABLE_KEY':
        return {
          type: 'warning',
          title: 'Missing Publishable Key',
          description:
            'A Stripe publishable key is required for Stripe integration.',
          troubleshooting: [
            'Go to your Stripe Dashboard → Developers → API keys',
            'Copy your Publishable key (starts with pk_test_ or pk_live_)',
            'Paste it in the "Publishable Key" field above',
          ],
        };

      case 'INVALID_PUBLISHABLE_KEY_FORMAT':
        return {
          type: 'danger',
          title: 'Invalid Publishable Key Format',
          description:
            'The publishable key format is incorrect. It should start with pk_test_ or pk_live_.',
          troubleshooting: [
            'Verify you copied the correct key from Stripe Dashboard',
            'Ensure the key starts with pk_test_ (for testing) or pk_live_ (for production)',
            'Check that the key is complete and not truncated',
            'Go to Stripe Dashboard → Developers → API keys to get the correct key',
          ],
        };

      case 'MISSING_BUY_BUTTON_IDS':
        return {
          type: 'warning',
          title: 'Missing Buy Button IDs',
          description:
            'At least one buy button ID is required for Stripe integration.',
          troubleshooting: [
            'Go to your Stripe Dashboard → Payment Links',
            'Create payment links for your products',
            'Click "Embed" → "Buy button" to get the buy button ID',
            'Copy the buy button ID (starts with buy_btn_) and paste it above',
          ],
        };

      case 'INVALID_BUY_BUTTON_ID_FORMAT':
        return {
          type: 'danger',
          title: 'Invalid Buy Button ID Format',
          description:
            'One or more buy button IDs have an incorrect format. They should start with buy_btn_.',
          troubleshooting: [
            'Verify you copied the buy button ID, not the payment link URL',
            'Buy button IDs should start with buy_btn_',
            'Go to Stripe Dashboard → Payment Links → Embed → Buy button',
            'Copy the buy button ID from the embed code',
          ],
        };

      case 'EMPTY_BUY_BUTTON_IDS':
        return {
          type: 'warning',
          title: 'Empty Buy Button IDs',
          description:
            'Some buy button ID fields are empty. Please remove empty lines or add valid IDs.',
          troubleshooting: [
            'Remove any empty lines from the buy button IDs field',
            'Ensure each line contains a valid buy button ID',
            'If you have fewer products, remove the extra empty lines',
          ],
        };

      case 'MIXED_ENVIRONMENT_KEYS':
        return {
          type: 'warning',
          title: 'Mixed Environment Keys',
          description:
            "You're using a test publishable key with live buy button IDs (or vice versa).",
          troubleshooting: [
            'Use pk_test_ keys with test buy button IDs for development',
            'Use pk_live_ keys with live buy button IDs for production',
            'Ensure all your Stripe configuration uses the same environment',
            'Check your Stripe Dashboard to verify the environment of your keys and payment links',
          ],
        };

      case 'TOO_MANY_BUY_BUTTON_IDS':
        return {
          type: 'warning',
          title: 'Too Many Buy Button IDs',
          description:
            'You have more buy button IDs than recommended. Consider organizing your products.',
          troubleshooting: [
            'Consider grouping related products into fewer payment links',
            'You can have multiple products in a single payment link',
            'Use product variations (size, color, etc.) instead of separate links',
            'Contact support if you need more than 20 buy button IDs',
          ],
        };

      default:
        return {
          type: 'danger',
          title: 'Configuration Error',
          description:
            error?.message ||
            'An unexpected error occurred while validating your Stripe configuration.',
          troubleshooting: [
            'Double-check all configuration fields',
            'Verify your Stripe account is active',
            "Ensure you're using the correct keys and IDs",
            'Contact support if you need assistance',
          ],
        };
    }
  };

  const alertConfig = parseStripeError();
  return <StaticAlert {...alertConfig} />;
};

export default StripeAlert;
