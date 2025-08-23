const editMemberFields = member => {
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
    { label: 'Name', name: 'name', type: 'text', initialValue: name },
    { label: 'Role', name: 'role', type: 'text', initialValue: role },
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

export default editMemberFields;
