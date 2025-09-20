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
          Click <strong>&ldquo;Develop apps&rdquo;</strong>
        </>,
        <>
          Click <strong>&ldquo;Create an app&rdquo;</strong>
        </>,
        <>Give your app a name (e.g., &ldquo;Band Storefront&rdquo;)</>,
        <>
          Under <strong>&ldquo;Configuration&rdquo;</strong>, click{' '}
          <strong>&ldquo;Configure&rdquo;</strong> next to Storefront API
        </>,
        <>
          Enable <strong>&ldquo;Read products, variants and collections&rdquo;</strong>
        </>,
        <>
          Click <strong>&ldquo;Save&rdquo;</strong>
        </>,
      ],
    },
    {
      label: 'Step 3: Generate Access Token',
      value: [
        <>
          In your app settings, go to <strong>&ldquo;API credentials&rdquo;</strong>
        </>,
        <>
          Under <strong>&ldquo;Storefront API&rdquo;</strong>, click{' '}
          <strong>&ldquo;Install app&rdquo;</strong>
        </>,
        <>
          Copy the <strong>Storefront access token</strong>
        </>,
        <>Paste it in the &ldquo;Storefront Access Token&rdquo; field above</>,
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
        <>Paste it in the &ldquo;Shop Domain&rdquo; field above</>,
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
          Click <strong>&ldquo;Create collection&rdquo;</strong>
        </>,
        <>Give it a name (e.g., &ldquo;Band Merchandise&rdquo;)</>,
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
        <>Paste it in the &ldquo;Collection ID&rdquo; field above</>,
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
    linkText: 'Shopify&rsquo;s documentation',
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
