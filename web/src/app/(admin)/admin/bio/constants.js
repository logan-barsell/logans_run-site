// Field definitions for Bio Edit form

export const BIO_FIELDS = [
  {
    name: 'customImage',
    type: 'image',
    conditionField: 'imageType',
    conditionValue: 'CUSTOM_IMAGE',
    required: false,
  },
  { type: 'divider' },
  {
    name: 'imageType',
    type: 'dropdown',
    label: 'Image Display Type',
    options: [
      { name: 'Icon Logo', value: 'BAND_LOGO' },
      { name: 'Header Logo', value: 'HEADER_LOGO' },
      { name: 'Custom Image', value: 'CUSTOM_IMAGE' },
    ],
    initialValue: 'BAND_LOGO',
    helperText:
      'Choose whether to display a logo or a custom image above the bio text.',
  },
  {
    name: 'text',
    type: 'textarea',
    label: 'Bio Text',
    rows: 6,
    required: true,
    placeholder: 'Enter your bio text here...',
  },
];

export const addMemberFields = [
  {
    label: 'Upload Image',
    name: 'bioPic',
    type: 'image',
    required: true,
  },
  { label: 'Name', name: 'name', type: 'text', required: true },
  { label: 'Role', name: 'role', type: 'text', required: true },
  {
    label: 'Facebook',
    name: 'facebook',
    type: 'facebookUrl',
    required: false,
    placeholder: 'Enter Facebook URL',
  },
  {
    label: 'Instagram',
    name: 'instagram',
    type: 'instagramUrl',
    required: false,
    placeholder: 'Enter Instagram URL',
  },
  {
    label: 'TikTok',
    name: 'tiktok',
    type: 'tiktokUrl',
    required: false,
    placeholder: 'Enter TikTok URL',
  },
  {
    label: 'YouTube',
    name: 'youtube',
    type: 'youtubeSocialUrl',
    required: false,
    placeholder: 'Enter YouTube URL',
  },
  {
    label: 'X',
    name: 'x',
    type: 'xUrl',
    required: false,
    placeholder: 'Enter X (Twitter) URL',
  },
];

export const editMemberFields = member => {
  const { bioPic, name, role, facebook, instagram, tiktok, youtube, x } =
    member;
  return [
    {
      label: 'Upload Image',
      name: 'bioPic',
      type: 'image',
      initialValue: bioPic,
      required: false,
    },
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      initialValue: name,
      required: true,
    },
    {
      label: 'Role',
      name: 'role',
      type: 'text',
      initialValue: role,
      required: true,
    },
    {
      label: 'Facebook',
      name: 'facebook',
      type: 'facebookUrl',
      initialValue: facebook,
      required: false,
      placeholder: 'Enter Facebook URL',
    },
    {
      label: 'Instagram',
      name: 'instagram',
      type: 'instagramUrl',
      initialValue: instagram,
      required: false,
      placeholder: 'Enter Instagram URL',
    },
    {
      label: 'TikTok',
      name: 'tiktok',
      type: 'tiktokUrl',
      initialValue: tiktok,
      required: false,
      placeholder: 'Enter TikTok URL',
    },
    {
      label: 'YouTube',
      name: 'youtube',
      type: 'youtubeSocialUrl',
      initialValue: youtube,
      required: false,
      placeholder: 'Enter YouTube URL',
    },
    {
      label: 'X',
      name: 'x',
      type: 'xUrl',
      initialValue: x,
      required: false,
      placeholder: 'Enter X (Twitter) URL',
    },
  ];
};
