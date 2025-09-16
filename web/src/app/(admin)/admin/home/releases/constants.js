export const releaseTypes = [
  { name: 'Album', value: 'ALBUM' },
  { name: 'Single', value: 'SINGLE' },
  { name: 'EP', value: 'EP' },
  { name: 'LP', value: 'LP' },
];

export const featuredReleaseFields = (release = {}, required = true) => [
  {
    label: 'Cover Image',
    name: 'coverImage',
    type: 'image',
    initialValue: release.coverImage || '',
    required,
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
    initialValue: release.type || 'ALBUM',
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: release.releaseDate ? new Date(release.releaseDate) : null,
  },
  {
    label: 'Music Link',
    name: 'musicLink',
    type: 'url',
    initialValue: release.musicLink || '',
    placeholder: 'Enter music streaming or purchase URL',
  },
];
