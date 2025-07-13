export const releaseTypes = [
  { name: 'Album', value: 'album' },
  { name: 'Single', value: 'single' },
  { name: 'EP', value: 'EP' },
  { name: 'LP', value: 'LP' },
];

export const featuredReleaseFields = (release = {}) => [
  {
    label: 'Cover Image',
    name: 'coverImage',
    type: 'image',
    initialValue: release.coverImage || '',
  },
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    initialValue: release.title || '',
  },
  {
    label: 'Type',
    name: 'type',
    type: 'options',
    options: releaseTypes,
    initialValue: release.type || 'album',
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: release.releaseDate ? new Date(release.releaseDate) : '',
  },
  {
    label: 'Music Link',
    name: 'musicLink',
    type: 'text',
    initialValue: release.musicLink || '',
  },
];
