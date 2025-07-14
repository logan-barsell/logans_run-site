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
      type: 'text',
      initialValue: facebook,
      required: false,
      placeholder: 'facebook.com/yourpage or https://facebook.com/yourpage',
    },
    {
      label: 'Instagram',
      name: 'instagram',
      type: 'text',
      initialValue: instagram,
      required: false,
      placeholder:
        'instagram.com/yourhandle or https://instagram.com/yourhandle',
    },
    {
      label: 'TikTok',
      name: 'tiktok',
      type: 'text',
      initialValue: tiktok,
      required: false,
      placeholder: 'tiktok.com/@yourhandle or https://tiktok.com/@yourhandle',
    },
    {
      label: 'YouTube',
      name: 'youtube',
      type: 'text',
      initialValue: youtube,
      required: false,
      placeholder: 'youtube.com/channel or https://youtube.com/channel',
    },
    {
      label: 'X',
      name: 'x',
      type: 'text',
      initialValue: x,
      required: false,
      placeholder: 'x.com/yourhandle or https://x.com/yourhandle',
    },
  ];
};

export default editMemberFields;
