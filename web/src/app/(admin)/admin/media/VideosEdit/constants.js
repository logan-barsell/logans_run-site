export const VIDEO_CATEGORIES = [
  { name: 'Live Performance', value: 'LIVE_PERFORMANCE' },
  { name: 'Vlog', value: 'VLOG' },
  { name: 'Music Video', value: 'MUSIC_VIDEO' },
  { name: 'Lyric Video', value: 'LYRIC_VIDEO' },
];

export const addVideoFields = [
  {
    label: 'Category',
    name: 'category',
    type: 'options',
    options: VIDEO_CATEGORIES,
    initialValue: 'MUSIC_VIDEO',
  },
  { label: 'Title', name: 'title', type: 'text', required: true },
  { label: 'Release Date', name: 'date', type: 'date', required: true },
  {
    label: 'YouTube Share Link',
    name: 'link',
    type: 'youtubeUrl',
    placeholder: 'Enter YouTube video URL',
    required: true,
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
      initialValue: category || 'MUSIC_VIDEO',
    },
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      initialValue: title || null,
      required: true,
    },
    {
      label: 'Release Date',
      name: 'date',
      type: 'date',
      initialValue: date ? new Date(date) : null,
      required: true,
    },
    {
      label: 'YouTube Share Link',
      name: 'link',
      type: 'youtubeUrl',
      initialValue: link || null,
      placeholder: 'Enter YouTube video URL',
      required: true,
    },
  ];
};

export const VIDEO_COUNT = 6;
