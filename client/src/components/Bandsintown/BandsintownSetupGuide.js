import React from 'react';
import SetupGuide from '../Bootstrap/SetupGuide';

const BandsintownSetupGuide = () => {
  const title = 'Bandsintown Setup Guide';

  const steps = [
    {
      label: 'Find Your Artist Name or ID',
      value: [
        'Go to Bandsintown.com and search for your artist profile',
        'Copy either your artist name (e.g., "Metallica") or your artist ID (e.g., "id_15516202")',
        'Artist IDs can be found in the URL when viewing your profile',
      ],
    },
    {
      label: 'Enter Your Artist Information',
      value: [
        'Paste your artist name or ID in the "Artist Name / ID" field above',
        'Click "Save Changes" to update your settings',
        'The widget will automatically load and display your upcoming shows',
      ],
    },
    {
      label: 'Verify Widget Display',
      value: [
        'Check that the Bandsintown widget appears below the form',
        'If you see "Sorry, this artist was not found on Bandsintown", double-check your artist name/ID',
        'The widget will show upcoming shows, ticket links, and venue information',
      ],
    },
    {
      label: 'Troubleshooting',
      value: [
        'Make sure your artist name matches exactly how it appears on Bandsintown',
        'If using an artist ID, ensure it starts with "id_" followed by the numeric ID',
        'Check that your artist has upcoming shows listed on Bandsintown',
        'The widget may take a few seconds to load after saving changes',
      ],
    },
  ];

  const documentation = {
    text: 'For more help, visit',
    url: 'https://artists.bandsintown.com/support/',
    linkText: 'Bandsintown Artist Support',
  };

  return (
    <SetupGuide
      title={title}
      steps={steps}
      documentation={documentation}
    />
  );
};

export default BandsintownSetupGuide;
