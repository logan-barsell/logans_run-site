// Shopify form field configuration
export const SHOPIFY_FIELDS = [
  {
    name: 'shopDomain',
    type: 'text',
    label: 'Shop Domain / URL',
    placeholder: 'your-store.myshopify.com',
    required: true,
  },
  {
    name: 'storefrontAccessToken',
    type: 'password',
    label: 'Storefront Access Token',
    placeholder: 'Enter your Shopify storefront access token',
    required: true,
  },
  {
    name: 'collectionId',
    type: 'text',
    label: 'Collection ID',
    placeholder: 'Enter the collection ID (numbers only)',
    required: true,
  },
];

// Stripe form field configuration
export const STRIPE_FIELDS = [
  {
    name: 'publishableKey',
    type: 'text',
    label: 'Publishable Key',
    placeholder: 'pk_test_... or pk_live_...',
    required: true,
    helperText:
      'Your Stripe publishable key. You can find this in your Stripe dashboard under Developers > API keys.',
    displayHelperText: true,
  },
  {
    name: 'paymentLinkIds',
    type: 'textarea',
    label: 'Buy Button IDs',
    placeholder: `Enter Stripe buy button IDs, one per line
buy_btn_1Rj6noHCVtmXVGiSacAIQc0j
buy_btn_1Rj6noHCVtmXVGiSacAIQc0k`,
    required: true,
    helperText:
      'Enter your Stripe buy button IDs, one per line. You can find these in your Stripe dashboard under Products > Payment Links.',
    displayHelperText: true,
  },
];

// External Store form field configuration
export const EXTERNAL_FIELDS = [
  {
    name: 'storefrontUrl',
    type: 'url',
    label: 'Store URL',
    placeholder: 'https://your-store.com',
    required: true,
  },
];

// Store type options for the selector
export const STORE_TYPE_OPTIONS = [
  { value: 'shopify', label: 'Shopify' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'external', label: 'External Store' },
];
