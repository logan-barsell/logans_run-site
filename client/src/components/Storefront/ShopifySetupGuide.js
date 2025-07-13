import React from 'react';
import SetupGuide from '../Bootstrap/SetupGuide';

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
          and sign up for a store
        </>,
        <>Choose a store name and complete the initial setup</>,
        <>Add your products to your Shopify store</>,
        <>Create a collection to organize your products</>,
      ],
      tip: {
        type: 'info',
        content:
          "You can use Shopify's free trial to test the integration before committing to a paid plan.",
      },
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
        <>Give your app a name (e.g., "Band Website Integration")</>,
        <>
          Click <strong>"Create app"</strong>
        </>,
      ],
    },
    {
      label: 'Step 3: Configure Storefront API Permissions',
      value: [
        <>
          In your app settings, click <strong>"Configure"</strong> under{' '}
          <strong>Storefront API</strong>
        </>,
        <>
          Enable the following permissions:
          <ul>
            <li>
              <strong>unauthenticated_read_product_listings</strong> - Required
              to display products
            </li>
            <li>
              <strong>unauthenticated_read_product_inventory</strong> - Shows
              inventory status
            </li>
            <li>
              <strong>unauthenticated_read_product_tags</strong> - For product
              categorization
            </li>
            <li>
              <strong>unauthenticated_read_collections</strong> - To access your
              collection
            </li>
          </ul>
        </>,
        <>
          Click <strong>"Save"</strong>
        </>,
      ],
      tip: {
        type: 'warning',
        content:
          'These are read-only permissions and are safe to use on public websites.',
      },
    },
    {
      label: 'Step 4: Generate Storefront Access Token',
      value: [
        <>
          In your app settings, go to <strong>Storefront API</strong> →{' '}
          <strong>Install app</strong>
        </>,
        <>
          Click <strong>"Install app"</strong> to install it on your store
        </>,
        <>
          After installation, go to <strong>Storefront API</strong> →{' '}
          <strong>Access tokens</strong>
        </>,
        <>
          Click <strong>"Create token"</strong>
        </>,
        <>Give your token a name (e.g., "Website Integration")</>,
        <>Copy the generated token - you'll need this for the configuration</>,
      ],
      tip: {
        type: 'danger',
        title: 'Security:',
        content:
          "Keep your access token secure. It's safe to use on public websites, but don't share it publicly.",
      },
    },
    {
      label: 'Step 5: Get Your Collection ID',
      value: [
        <>
          In your Shopify admin, go to <strong>Products</strong> →{' '}
          <strong>Collections</strong>
        </>,
        <>Click on the collection you want to display on your website</>,
        <>
          Look at the URL in your browser - it will look like:{' '}
          <code>
            https://your-store.myshopify.com/admin/collections/123456789
          </code>
        </>,
        <>
          The collection ID is the number at the end (in this example:{' '}
          <code>123456789</code>)
        </>,
        <>Copy this number - you'll need it for the configuration</>,
      ],
      tip: {
        type: 'info',
        content:
          'You can create multiple collections for different types of merchandise (e.g., "T-Shirts", "CDs", "Posters").',
      },
    },
    {
      label: 'Step 6: Configure Your Website',
      value: [
        <>
          In your website admin, go to <strong>Store Configuration</strong>
        </>,
        <>
          Select <strong>"Shopify"</strong> as your store type
        </>,
        <>
          Enter your <strong>Shop Domain</strong> (e.g.,{' '}
          <code>your-store.myshopify.com</code>)
        </>,
        <>
          Paste your <strong>Storefront Access Token</strong>
        </>,
        <>
          Enter your <strong>Collection ID</strong>
        </>,
        <>
          Click <strong>"Save Changes"</strong>
        </>,
      ],
      tip: {
        type: 'success',
        content:
          'Your Shopify store should now be connected to your website. Test it by visiting your store page.',
      },
    },
  ];

  const documentation = {
    text: 'Need help?',
    url: 'https://shopify.dev/docs/storefront-api',
    linkText: "Shopify's Storefront API documentation",
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
