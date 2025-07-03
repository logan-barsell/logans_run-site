const editMemberFields = member => {
  const { bioPic, name, role, facebook, instagram, tiktok, youtube, x } =
    member;
  return [
    {
      label: 'Upload Image',
      name: 'bioPic',
      type: 'image',
      initialValue: bioPic,
    },
    { label: 'Name', name: 'name', type: 'text', initialValue: name },
    { label: 'Role', name: 'role', type: 'text', initialValue: role },
    {
      label: 'Facebook',
      name: 'facebook',
      type: 'text',
      initialValue: facebook,
      required: false,
    },
    {
      label: 'Instagram',
      name: 'instagram',
      type: 'text',
      initialValue: instagram,
      required: false,
    },
    {
      label: 'TikTok',
      name: 'tiktok',
      type: 'text',
      initialValue: tiktok,
      required: false,
    },
    {
      label: 'YouTube',
      name: 'youtube',
      type: 'text',
      initialValue: youtube,
      required: false,
    },
    { label: 'X', name: 'x', type: 'text', initialValue: x, required: false },
  ];
};

export default editMemberFields;
