import React from 'react';
import SetupGuide from './SetupGuide';

// Example of how to use the reusable SetupGuide component
const SetupGuideExample = () => {
  // Example steps for a FAQ setup guide
  const faqSteps = [
    {
      label: 'How do I update my band information?',
      value: [
        <>Go to the admin panel and navigate to "Bio" section</>,
        <>
          You can update your band description, add/remove members, and manage
          social media links
        </>,
        <>All changes are saved automatically</>,
      ],
    },
    {
      label: 'Can I customize the website theme?',
      value: [
        <>Yes! You can customize various aspects of your website:</>,
        <>
          <ul>
            <li>
              <strong>Colors:</strong> Change primary and secondary colors
            </li>
            <li>
              <strong>Fonts:</strong> Select from multiple font options
            </li>
            <li>
              <strong>Logo:</strong> Upload your band logo
            </li>
            <li>
              <strong>Background:</strong> Set custom background images
            </li>
          </ul>
        </>,
        <>Go to "Theme" in the admin panel to make these changes</>,
      ],
      tip: {
        type: 'info',
        content:
          'Theme changes are applied immediately and affect all pages on your website.',
      },
    },
    {
      label: 'How do I add new shows?',
      value: [
        <>You can add shows in two ways:</>,
        <>
          <ol>
            <li>
              <strong>Manual Entry:</strong> Go to "Shows" in admin and click
              "Add Show"
            </li>
            <li>
              <strong>Bandsintown Integration:</strong> Connect your Bandsintown
              artist profile for automatic sync
            </li>
          </ol>
        </>,
      ],
      tip: {
        type: 'success',
        title: 'Tip:',
        content:
          'Bandsintown integration will automatically keep your shows up to date!',
      },
    },
  ];

  const documentation = {
    text: 'Need more help?',
    url: '/contact',
    linkText: 'Contact our support team',
  };

  return (
    <div className='setup-guide-example'>
      <h3>Setup Guide Component Example</h3>
      <p>
        This demonstrates how to use the reusable SetupGuide component for FAQs
        or other setup guides.
      </p>

      <SetupGuide
        title='Frequently Asked Questions'
        steps={faqSteps}
        documentation={documentation}
      />
    </div>
  );
};

export default SetupGuideExample;
