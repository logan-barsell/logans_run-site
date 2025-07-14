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
  { label: 'Spotify Link', name: 'spotifyLink', type: 'spotifyUrl' },
  { label: 'Apple Music Link', name: 'appleMusicLink', type: 'text' },
  { label: 'YouTube Link', name: 'youtubeLink', type: 'text' },
  { label: 'SoundCloud Link', name: 'soundcloudLink', type: 'text' },
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
    },
    {
      label: 'Apple Music Link',
      name: 'appleMusicLink',
      type: 'text',
      initialValue: appleMusicLink,
    },
    {
      label: 'YouTube Link',
      name: 'youtubeLink',
      type: 'text',
      initialValue: youtubeLink,
    },
    {
      label: 'SoundCloud Link',
      name: 'soundcloudLink',
      type: 'text',
      initialValue: soundcloudLink,
    },
  ];
};
