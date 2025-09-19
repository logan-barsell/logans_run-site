export const featuredVideoFields = (video = {}, required = true) => [
  {
    label: 'Upload Video',
    name: 'videoFile',
    type: 'video',
    conditions: [{ videoType: 'UPLOAD' }],
    required,
  },
  {
    label: 'Preview Type',
    name: 'videoType',
    type: 'select',
    options: [
      { value: 'YOUTUBE', name: 'YouTube Snippet' },
      { value: 'UPLOAD', name: 'Upload Video' },
    ],
    initialValue: video.videoType || 'UPLOAD',
  },
  {
    label: 'Display Mode',
    name: 'displayMode',
    type: 'select',
    options: [
      { value: 'FULL', name: 'Captions (with YouTube link)' },
      { value: 'VIDEO_ONLY', name: 'Video Only' },
    ],
    initialValue: video.displayMode || 'FULL',
  },
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    conditions: [{ displayMode: 'FULL' }],
    initialValue: video.title || '',
    required,
  },
  {
    label: 'Description',
    name: 'description',
    type: 'text',
    conditions: [{ displayMode: 'FULL' }],
    initialValue: video.description || '',
    required,
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'youtubeUrl',
    conditions: [
      { videoType: 'YOUTUBE' }, // Always show for YouTube Snippet
      { videoType: 'UPLOAD', displayMode: 'FULL' }, // Show for Upload + Captions
    ],
    initialValue: video.youtubeLink || '',
    placeholder: 'Enter YouTube video URL',
    required,
  },
  {
    label: 'Start Time (seconds)',
    name: 'startTime',
    type: 'number',
    conditions: [{ videoType: 'YOUTUBE' }],
    initialValue: video.startTime || 0,
    min: 0,
    required,
  },
  {
    label: 'End Time (seconds)',
    name: 'endTime',
    type: 'number',
    conditions: [{ videoType: 'YOUTUBE' }],
    initialValue: video.endTime || 10,
    min: 0,
    required,
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: video.releaseDate ? new Date(video.releaseDate) : null,
    required,
  },
];
