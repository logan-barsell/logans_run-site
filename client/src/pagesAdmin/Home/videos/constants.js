export const featuredVideoFields = (video = {}) => [
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    initialValue: video.title || '',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'text',
    initialValue: video.description || '',
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'youtubeUrl',
    initialValue: video.youtubeLink || '',
    placeholder: 'Enter YouTube video URL',
  },
  {
    label: 'Start Time (seconds)',
    name: 'startTime',
    type: 'number',
    initialValue: video.startTime || '',
  },
  {
    label: 'End Time (seconds)',
    name: 'endTime',
    type: 'number',
    initialValue: video.endTime || '',
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: video.releaseDate ? new Date(video.releaseDate) : null,
  },
];
