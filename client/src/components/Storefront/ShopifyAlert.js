import React from 'react';
import StaticAlert from '../Alert/StaticAlert';

const ShopifyAlert = ({ error, response }) => {
  // If no error, don't render anything
  if (!error && !response) {
    return null;
  }

  // Parse different types of Shopify errors
  const parseShopifyError = () => {
    // Check for SHOP_NOT_FOUND error code first (even from network errors)
    if (error?.extensions?.code === 'SHOP_NOT_FOUND') {
      return {
        type: 'danger',
        title: 'Shop Not Found',
        description:
          'The specified shop domain could not be found or is invalid.',
        troubleshooting: [
          'Verify your shop domain format (e.g., your-store.myshopify.com)',
          'Check that your Shopify store is active and not suspended',
          "Ensure you're using the correct shop domain",
          'Try accessing your shop directly in a browser',
        ],
      };
    }

    // Network/connection errors (only for actual network issues)
    if (
      error?.message?.includes('fetch') ||
      error?.message?.includes('network')
    ) {
      return {
        type: 'danger',
        title: 'Connection Error',
        description:
          'Unable to connect to Shopify. Please check your internet connection and try again.',
        troubleshooting: [
          'Check your internet connection',
          'Verify that Shopify is accessible from your network',
          'Try refreshing the page and testing again',
        ],
      };
    }

    // Authentication errors (401, 403)
    if (response?.status === 401 || response?.status === 403) {
      return {
        type: 'danger',
        title: 'Authentication Error',
        description:
          'Your Shopify access token is invalid or has expired. Please generate a new Storefront access token.',
        troubleshooting: [
          'Go to your Shopify admin → Settings → Apps and sales channels',
          'Find your app and click "Configure" under Storefront API',
          'Generate a new access token',
          'Update the token in your website configuration',
        ],
      };
    }

    // Not found errors (404)
    if (response?.status === 404) {
      return {
        type: 'warning',
        title: 'Resource Not Found',
        description:
          'The specified collection or shop domain could not be found. Please verify your configuration.',
        troubleshooting: [
          'Verify your shop domain is correct (should end with .myshopify.com)',
          'Check that the collection ID exists in your Shopify store',
          'Ensure the collection is published and accessible',
          'Verify your Storefront API permissions include collection access',
        ],
      };
    }

    // Rate limiting (429)
    if (response?.status === 429) {
      return {
        type: 'warning',
        title: 'Rate Limit Exceeded',
        description:
          'Too many requests to Shopify API. Please wait a moment and try again.',
        troubleshooting: [
          'Wait 1-2 minutes before trying again',
          'Check your Shopify API usage limits',
          'Consider upgrading your Shopify plan if this happens frequently',
        ],
      };
    }

    // Server errors (5xx)
    if (response?.status >= 500) {
      return {
        type: 'danger',
        title: 'Shopify Server Error',
        description:
          'Shopify is experiencing technical difficulties. Please try again later.',
        troubleshooting: [
          'Wait a few minutes and try again',
          "Check Shopify's status page for any ongoing issues",
          'If the problem persists, contact Shopify support',
        ],
      };
    }

    // GraphQL errors (common in Shopify API)
    if (error?.extensions?.code || error?.message?.includes('GraphQL')) {
      const graphqlError = error?.extensions?.code || 'GRAPHQL_ERROR';

      // Check for specific field errors that indicate invalid collection ID
      if (
        error?.message?.includes("doesn't exist on type 'Collection'") ||
        (error?.message?.includes('Field') &&
          error?.message?.includes("doesn't exist"))
      ) {
        return {
          type: 'warning',
          title: 'Collection Not Found',
          description:
            'The specified collection ID does not exist or is not accessible.',
          troubleshooting: [
            'Verify the collection ID in your Shopify admin',
            'Ensure the collection is published and not private',
            'Check that the collection contains products',
            'Try creating a new collection and updating the ID',
          ],
        };
      }

      switch (graphqlError) {
        case 'ACCESS_DENIED':
          return {
            type: 'danger',
            title: 'Access Denied',
            description:
              'Your access token does not have the required permissions to access this collection.',
            troubleshooting: [
              'Verify your Storefront API permissions include:',
              '• unauthenticated_read_product_listings',
              '• unauthenticated_read_collections',
              '• unauthenticated_read_product_inventory',
              'Regenerate your access token if needed',
            ],
          };

        case 'COLLECTION_NOT_FOUND':
          return {
            type: 'warning',
            title: 'Collection Not Found',
            description:
              'The specified collection ID does not exist or is not accessible.',
            troubleshooting: [
              'Verify the collection ID in your Shopify admin',
              'Ensure the collection is published and not private',
              'Check that the collection contains products',
              'Try creating a new collection and updating the ID',
            ],
          };

        case 'SHOP_NOT_FOUND':
          return {
            type: 'danger',
            title: 'Shop Not Found',
            description:
              'The specified shop domain could not be found or is invalid.',
            troubleshooting: [
              'Verify your shop domain format (e.g., your-store.myshopify.com)',
              'Check that your Shopify store is active and not suspended',
              "Ensure you're using the correct shop domain",
              'Try accessing your shop directly in a browser',
            ],
          };

        default:
          return {
            type: 'danger',
            title: 'Shopify API Error',
            description:
              error?.message ||
              'An unexpected error occurred while connecting to Shopify.',
            troubleshooting: [
              'Verify all configuration fields are correct',
              'Check that your Shopify store is active',
              'Try regenerating your access token',
              'Contact support if the problem persists',
            ],
          };
      }
    }

    // Generic error handling
    if (error?.message) {
      return {
        type: 'danger',
        title: 'Configuration Error',
        description: error.message,
        troubleshooting: [
          'Double-check all configuration fields',
          'Verify your Shopify store is active',
          'Test your configuration with a simple API call',
          'Contact support if you need assistance',
        ],
      };
    }

    // Fallback for unknown errors
    return {
      type: 'danger',
      title: 'Unknown Error',
      description:
        'An unexpected error occurred while validating your Shopify configuration.',
      troubleshooting: [
        'Refresh the page and try again',
        'Verify all configuration fields are correct',
        'Check that your Shopify store is accessible',
        'Contact support for assistance',
      ],
    };
  };

  const alertConfig = parseShopifyError();

  return <StaticAlert {...alertConfig} />;
};

export default ShopifyAlert;
