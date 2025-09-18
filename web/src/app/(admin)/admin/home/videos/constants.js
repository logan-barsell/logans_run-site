export const featuredVideoFields = (video = {}) => [
  {
    label: 'Upload Video',
    name: 'videoFile',
    type: 'conditionalVideo',
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
    type: 'conditionalText',
    conditionField: 'displayMode',
    conditionValue: 'FULL',
    initialValue: video.title || '',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'conditionalText',
    conditionField: 'displayMode',
    conditionValue: 'FULL',
    initialValue: video.description || '',
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'conditionalYoutubeUrl',
    conditions: [
      { videoType: 'YOUTUBE' }, // Always show for YouTube Snippet
      { videoType: 'UPLOAD', displayMode: 'FULL' }, // Show for Upload + Captions
    ],
    initialValue: video.youtubeLink || '',
    placeholder: 'Enter YouTube video URL',
  },
  {
    label: 'Start Time (seconds)',
    name: 'startTime',
    type: 'conditionalNumber',
    conditionField: 'videoType',
    conditionValue: 'YOUTUBE',
    initialValue: video.startTime || 0,
    min: 0,
  },
  {
    label: 'End Time (seconds)',
    name: 'endTime',
    type: 'conditionalNumber',
    conditionField: 'videoType',
    conditionValue: 'YOUTUBE',
    initialValue: video.endTime || 10,
    min: 0,
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: video.releaseDate ? new Date(video.releaseDate) : null,
  },
];
