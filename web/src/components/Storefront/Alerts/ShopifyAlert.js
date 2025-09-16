import React from 'react';
import StaticAlert from '../../Alert/StaticAlert';

const ShopifyAlert = ({ error, response }) => {
  // If no error, don't render anything
  if (!error) {
    return null;
  }

  // Parse different types of Shopify validation errors
  const parseShopifyError = () => {
    const errorCode = error?.extensions?.code || 'UNKNOWN_ERROR';
    const errorMessage = error?.message || '';

    switch (errorCode) {
      case 'SHOP_NOT_FOUND':
        return {
          type: 'danger',
          title: 'Shop Not Found',
          description:
            'The Shopify store domain could not be found or is not accessible.',
          troubleshooting: [
            'Verify your shop domain is correct (e.g., your-store.myshopify.com)',
            'Ensure your Shopify store is active and not suspended',
            "Check that the domain doesn't have typos or extra characters",
            "Make sure you're using the myshopify.com domain, not a custom domain",
            'If using a custom domain, use the myshopify.com version instead',
          ],
        };

      case 'ACCESS_DENIED':
      case 'UNAUTHORIZED':
        return {
          type: 'danger',
          title: 'Access Denied',
          description:
            'The storefront access token is invalid or has insufficient permissions.',
          troubleshooting: [
            'Go to your Shopify Admin → Settings → Apps and sales channels',
            'Click "Develop apps" → Find your app → "Configure"',
            'Under "Storefront API", ensure "Read products, variants and collections" is enabled',
            'Generate a new Storefront access token',
            'Replace the old token with the new one in your configuration',
          ],
        };

      case 'COLLECTION_NOT_FOUND':
        return {
          type: 'warning',
          title: 'Collection Not Found',
          description:
            'The specified collection ID could not be found in your Shopify store.',
          troubleshooting: [
            'Go to your Shopify Admin → Products → Collections',
            'Find the collection you want to display',
            'Copy the collection ID from the URL (the number after /collections/)',
            'Ensure the collection is published and not private',
            'Check that the collection contains products',
          ],
        };

      case 'INVALID_COLLECTION_ID':
        return {
          type: 'danger',
          title: 'Invalid Collection ID',
          description:
            "The collection ID format is incorrect or the collection doesn't exist.",
          troubleshooting: [
            'Collection IDs should be numeric (e.g., 123456789)',
            'Go to Shopify Admin → Products → Collections',
            'Click on the collection and copy the ID from the URL',
            "Make sure you're copying the collection ID, not the handle",
            'Verify the collection exists and is accessible',
          ],
        };

      case 'STORE_NOT_ACCESSIBLE':
        return {
          type: 'warning',
          title: 'Store Not Accessible',
          description:
            'Your Shopify store may be in development mode, password-protected, or has restricted access.',
          troubleshooting: [
            'Check if your store is in development mode (Settings → General)',
            'Remove any password protection from your store',
            'Ensure your store is published and not in maintenance mode',
            'Verify your store is not suspended or restricted',
            'Contact Shopify support if the issue persists',
          ],
        };

      case 'NETWORK_ERROR':
        return {
          type: 'danger',
          title: 'Network Error',
          description:
            'Unable to connect to your Shopify store. This may be a temporary issue.',
          troubleshooting: [
            'Check your internet connection',
            'Verify the shop domain is correct and accessible',
            'Try again in a few minutes',
            "If the problem persists, check Shopify's status page",
            'Contact support if the issue continues',
          ],
        };

      case 'GRAPHQL_ERROR':
        return {
          type: 'danger',
          title: 'GraphQL Error',
          description: `Shopify returned an error: ${errorMessage}`,
          troubleshooting: [
            'This may be a temporary Shopify API issue',
            'Check that your storefront access token is valid',
            'Verify your collection ID is correct',
            'Ensure your store is not in maintenance mode',
            'Try again in a few minutes',
          ],
        };

      default:
        return {
          type: 'danger',
          title: 'Configuration Error',
          description:
            errorMessage ||
            'An unexpected error occurred while validating your Shopify configuration.',
          troubleshooting: [
            'Double-check all configuration fields',
            'Verify your Shopify store is active',
            'Ensure your storefront access token is valid',
            'Check that your collection ID is correct',
            'Contact support if you need assistance',
          ],
        };
    }
  };

  const alertConfig = parseShopifyError();
  return <StaticAlert {...alertConfig} />;
};

export default ShopifyAlert;
