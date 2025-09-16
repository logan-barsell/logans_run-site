import React from 'react';
import SetupGuide from '../../SetupGuides/SetupGuide';

const ShopifySetupGuide = () => {
  const steps = [
    {
      label: 'Step 1: Create a Shopify Store',
      value: [
        <>
          Go to{' '}
          <a
            href='https://www.shopify.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            Shopify.com
          </a>{' '}
          and create a new store
        </>,
        <>Choose a plan (you can start with a free trial)</>,
        <>Complete the store setup process</>,
      ],
    },
    {
      label: 'Step 2: Enable Storefront API',
      value: [
        <>
          In your Shopify admin, go to <strong>Settings</strong> →{' '}
          <strong>Apps and sales channels</strong>
        </>,
        <>
          Click <strong>"Develop apps"</strong>
        </>,
        <>
          Click <strong>"Create an app"</strong>
        </>,
        <>Give your app a name (e.g., "Band Storefront")</>,
        <>
          Under <strong>"Configuration"</strong>, click{' '}
          <strong>"Configure"</strong> next to Storefront API
        </>,
        <>
          Enable <strong>"Read products, variants and collections"</strong>
        </>,
        <>
          Click <strong>"Save"</strong>
        </>,
      ],
    },
    {
      label: 'Step 3: Generate Access Token',
      value: [
        <>
          In your app settings, go to <strong>"API credentials"</strong>
        </>,
        <>
          Under <strong>"Storefront API"</strong>, click{' '}
          <strong>"Install app"</strong>
        </>,
        <>
          Copy the <strong>Storefront access token</strong>
        </>,
        <>Paste it in the "Storefront Access Token" field above</>,
      ],
      tip: {
        type: 'warning',
        content:
          'Keep your access token secure. Never share it publicly or commit it to version control.',
      },
    },
    {
      label: 'Step 4: Get Your Shop Domain',
      value: [
        <>
          In your Shopify admin, go to <strong>Settings</strong> →{' '}
          <strong>Domains</strong>
        </>,
        <>
          Copy your <strong>myshopify.com domain</strong> (e.g.,{' '}
          <code>your-store.myshopify.com</code>)
        </>,
        <>Paste it in the "Shop Domain" field above</>,
      ],
      tip: {
        type: 'info',
        content:
          'Use your myshopify.com domain, not a custom domain, for the API connection.',
      },
    },
    {
      label: 'Step 5: Create a Collection',
      value: [
        <>
          In your Shopify admin, go to <strong>Products</strong> →{' '}
          <strong>Collections</strong>
        </>,
        <>
          Click <strong>"Create collection"</strong>
        </>,
        <>Give it a name (e.g., "Band Merchandise")</>,
        <>Add your products to the collection</>,
        <>
          Make sure the collection is <strong>published</strong>
        </>,
      ],
    },
    {
      label: 'Step 6: Get Collection ID',
      value: [
        <>Go to your collection page in Shopify admin</>,
        <>Look at the URL in your browser</>,
        <>
          Copy the collection ID (the number after <code>/collections/</code>)
        </>,
        <>Paste it in the "Collection ID" field above</>,
      ],
      tip: {
        type: 'info',
        content:
          'The collection ID is a number, not the collection handle (which is the text part of the URL).',
      },
    },
  ];

  const documentation = {
    text: 'Need help?',
    url: 'https://shopify.dev/docs/storefront-api',
    linkText: "Shopify's documentation",
  };

  return (
    <SetupGuide
      title='Shopify Setup Guide'
      steps={steps}
      documentation={documentation}
    />
  );
};

export default ShopifySetupGuide;
