import React from 'react';
import SetupGuide from '../../SetupGuides/SetupGuide';

const StripeSetupGuide = () => {
  const steps = [
    {
      label: 'Step 1: Create Products in Stripe',
      value: [
        <>
          Go to your{' '}
          <a
            href='https://dashboard.stripe.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            Stripe Dashboard
          </a>
        </>,
        <>
          Navigate to <strong>Products</strong> in the left sidebar
        </>,
        <>
          Click <strong>&ldquo;Add product&rdquo;</strong>
        </>,
        <>
          Fill in your product details:
          <ul>
            <li>
              <strong>Name:</strong> Product name (e.g., &ldquo;Band T-Shirt&rdquo;)
            </li>
            <li>
              <strong>Description:</strong> Product description
            </li>
            <li>
              <strong>Images:</strong> Upload product photos
            </li>
            <li>
              <strong>Pricing:</strong> Set your price and currency
            </li>
          </ul>
        </>,
        <>
          Click <strong>&ldquo;Save product&rdquo;</strong>
        </>,
      ],
    },
    {
      label: 'Step 2: Create Payment Links',
      value: [
        <>
          In Stripe Dashboard, go to <strong>Payment Links</strong>
        </>,
        <>
          Click <strong>&ldquo;Create payment link&rdquo;</strong>
        </>,
        <>Select your product from the dropdown</>,
        <>
          Click <strong>&ldquo;Create link&rdquo;</strong>
        </>,
      ],
    },
    {
      label: 'Step 3: Get Buy Button IDs',
      value: [
        <>
          Find your payment link in the <strong>Payment Links</strong> section
        </>,
        <>Click on the payment link to view it</>,
        <>
          Click the <strong>&ldquo;Embed&rdquo;</strong> button (not &ldquo;Share&rdquo;)
        </>,
        <>
          Select <strong>&ldquo;Buy button&rdquo;</strong> from the embed options
        </>,
        <>
          Copy the <strong>buy button ID</strong> (starts with{' '}
          <code>buy_btn_</code>)
        </>,
        <>Paste it into the &ldquo;Buy Button IDs&rdquo; field above</>,
      ],
      tip: {
        type: 'info',
        content:
          "The buy button ID is different from the payment link URL. Make sure you&rsquo;re copying the buy button ID, not the payment link.",
      },
    },
    {
      label: 'Step 4: Add Product Variations (Size, Color, etc.)',
      value: [
        <>
          Go to your payment link and click <strong>&ldquo;Edit&rdquo;</strong>
        </>,
        <>
          Scroll down to <strong>&ldquo;Additional options&rdquo;</strong>
        </>,
        <>
          Click <strong>&ldquo;Add option&rdquo;</strong>
        </>,
        <>
          Choose the option type:
          <ul>
            <li>
              <strong>Dropdown:</strong> For size, color, style options
            </li>
            <li>
              <strong>Number:</strong> For quantity limits
            </li>
            <li>
              <strong>Text:</strong> For custom text (name, message)
            </li>
            <li>
              <strong>File upload:</strong> For custom artwork
            </li>
          </ul>
        </>,
        <>
          Configure the options:
          <ul>
            <li>
              <strong>Label:</strong> &ldquo;Size&rdquo;, &ldquo;Color&rdquo;, &ldquo;Quantity&rdquo;
            </li>
            <li>
              <strong>Options:</strong> S, M, L, XL (for dropdowns)
            </li>
            <li>
              <strong>Required:</strong> Check if customers must select this
            </li>
          </ul>
        </>,
        <>
          Click <strong>&ldquo;Save&rdquo;</strong>
        </>,
      ],
      tip: {
        type: 'success',
        title: 'Pro tip:',
        content:
          'You can add multiple variations to the same product. For example, a t-shirt could have size AND color options.',
      },
    },
    {
      label: 'Step 5: Get Your Publishable Key',
      value: [
        <>
          In Stripe Dashboard, go to <strong>Developers</strong> →{' '}
          <strong>API keys</strong>
        </>,
        <>
          Find your <strong>Publishable key</strong> (starts with{' '}
          <code>pk_test_</code> or <code>pk_live_</code>)
        </>,
        <>Copy the key and paste it in the &ldquo;Publishable Key&rdquo; field above</>,
      ],
      tip: {
        type: 'warning',
        content:
          'Use pk_test_ keys for testing and pk_live_ keys for production. Never share your secret keys!',
      },
    },
  ];

  const documentation = {
    text: 'Need help?',
    url: 'https://stripe.com/docs',
    linkText: 'Stripe&rsquo;s documentation',
  };

  return (
    <SetupGuide
      title='Stripe Setup Guide'
      steps={steps}
      documentation={documentation}
    />
  );
};

export default StripeSetupGuide;
