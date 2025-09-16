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
      { value: 'youtube', name: 'YouTube Snippet' },
      { value: 'upload', name: 'Upload Video' },
    ],
    initialValue: video.videoType || 'upload',
  },
  {
    label: 'Display Mode',
    name: 'displayMode',
    type: 'select',
    options: [
      { value: 'full', name: 'Captions (with YouTube link)' },
      { value: 'videoOnly', name: 'Video Only' },
    ],
    initialValue: video.displayMode || 'full',
  },
  {
    label: 'Title',
    name: 'title',
    type: 'conditionalText',
    conditionField: 'displayMode',
    conditionValue: 'full',
    initialValue: video.title || '',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'conditionalText',
    conditionField: 'displayMode',
    conditionValue: 'full',
    initialValue: video.description || '',
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'conditionalYoutubeUrl',
    conditions: [
      { videoType: 'youtube' }, // Always show for YouTube Snippet
      { videoType: 'upload', displayMode: 'full' }, // Show for Upload + Captions
    ],
    initialValue: video.youtubeLink || '',
    placeholder: 'Enter YouTube video URL',
  },
  {
    label: 'Start Time (seconds)',
    name: 'startTime',
    type: 'conditionalNumber',
    conditionField: 'videoType',
    conditionValue: 'youtube',
    initialValue: video.startTime || 0,
    min: 0,
  },
  {
    label: 'End Time (seconds)',
    name: 'endTime',
    type: 'conditionalNumber',
    conditionField: 'videoType',
    conditionValue: 'youtube',
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
