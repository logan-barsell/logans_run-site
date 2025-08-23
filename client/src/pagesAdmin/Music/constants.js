export const ADD_PLAYER_FIELDS = [
  {
    label: 'Background Color',
    name: 'bgColor',
    type: 'options',
    options: [
      { name: 'Gray', value: '&theme=0' },
      { name: 'Red', value: '' },
    ],
    initialValue: '&theme=0',
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

  return [
    {
      label: 'Background Color',
      name: 'bgColor',
      type: 'options',
      options: [
        { name: 'Gray', value: '&theme=0' },
        { name: 'Red', value: '' },
      ],
      initialValue: bgColor,
    },
    { label: 'Title', name: 'title', type: 'text', initialValue: title },
    { label: 'Release Date', name: 'date', type: 'date', initialValue: date },
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
