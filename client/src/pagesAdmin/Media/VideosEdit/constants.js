export const VIDEO_CATEGORIES = [
  { name: 'Music Videos', value: 'musicVids' },
  { name: 'Live Performances', value: 'liveVids' },
  { name: 'Vlogs', value: 'vlogs' },
];

export const addVideoFields = [
  {
    label: 'Category',
    name: 'category',
    type: 'options',
    options: VIDEO_CATEGORIES,
    initialValue: 'musicVids',
  },
  { label: 'Title', name: 'title', type: 'text' },
  { label: 'Release Date', name: 'date', type: 'date' },
  {
    label: 'YouTube Share Link',
    name: 'link',
    type: 'youtubeUrl',
    placeholder: 'Enter YouTube video URL',
  },
];

export const editVideoFields = video => {
  const { category, title, date, link } = video;

  return [
    {
      label: 'Category',
      name: 'category',
      type: 'options',
      options: VIDEO_CATEGORIES,
      initialValue: category,
    },
    { label: 'Title', name: 'title', type: 'text', initialValue: title },
    { label: 'Release Date', name: 'date', type: 'date', initialValue: date },
    {
      label: 'YouTube Share Link',
      name: 'link',
      type: 'youtubeUrl',
      initialValue: link,
      placeholder: 'Enter YouTube video URL',
    },
  ];
};

export const VIDEO_COUNT = 6;
