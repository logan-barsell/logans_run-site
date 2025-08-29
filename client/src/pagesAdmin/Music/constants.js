export const ADD_PLAYER_FIELDS = [
  {
    label: 'Background Color',
    name: 'bgColor',
    type: 'options',
    options: [
      { name: 'Auto (from artwork)', value: 'auto' },
      { name: 'Dark', value: '0' },
      { name: 'Light', value: '1' },
    ],
    initialValue: 'auto',
  },
  { label: 'Title', name: 'title', type: 'text' },
  { label: 'Release Date', name: 'date', type: 'date' },
  {
    label: 'Spotify Link',
    name: 'spotifyLink',
    type: 'spotifyUrl',
    placeholder: 'Enter Spotify URL',
  },
  {
    label: 'Apple Music Link',
    name: 'appleMusicLink',
    type: 'appleMusicUrl',
    placeholder: 'Enter Apple Music URL',
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'youtubeUrl',
    placeholder: 'Enter YouTube URL',
  },
  {
    label: 'SoundCloud Link',
    name: 'soundcloudLink',
    type: 'soundcloudUrl',
    placeholder: 'Enter SoundCloud URL',
  },
];

export const editPlayerFields = player => {
  const {
    bgColor,
    title,
    date,
    spotifyLink,
    appleMusicLink,
    youtubeLink,
    soundcloudLink,
  } = player;

  // Convert date to proper Date object for the date picker
  let formattedDate = null;
  if (date) {
    try {
      formattedDate = new Date(date);
      // Check if the date is valid
      if (isNaN(formattedDate.getTime())) {
        formattedDate = null;
      }
    } catch (error) {
      formattedDate = null;
    }
  }

  return [
    {
      label: 'Background Color',
      name: 'bgColor',
      type: 'options',
      options: [
        { name: 'Auto (from artwork)', value: 'auto' },
        { name: 'Dark', value: '0' },
        { name: 'Light', value: '1' },
      ],
      initialValue: bgColor || '0',
    },
    { label: 'Title', name: 'title', type: 'text', initialValue: title },
    {
      label: 'Release Date',
      name: 'date',
      type: 'date',
      initialValue: formattedDate,
    },
    {
      label: 'Spotify Link',
      name: 'spotifyLink',
      type: 'spotifyUrl',
      initialValue: spotifyLink,
      placeholder: 'Enter Spotify URL',
    },
    {
      label: 'Apple Music Link',
      name: 'appleMusicLink',
      type: 'appleMusicUrl',
      initialValue: appleMusicLink,
      placeholder: 'Enter Apple Music URL',
    },
    {
      label: 'YouTube Link',
      name: 'youtubeLink',
      type: 'youtubeUrl',
      initialValue: youtubeLink,
      placeholder: 'Enter YouTube URL',
    },
    {
      label: 'SoundCloud Link',
      name: 'soundcloudLink',
      type: 'soundcloudUrl',
      initialValue: soundcloudLink,
      placeholder: 'Enter SoundCloud URL',
    },
  ];
};
