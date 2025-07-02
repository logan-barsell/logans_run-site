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
    },
    {
      label: 'Instagram',
      name: 'instagram',
      type: 'text',
      initialValue: instagram,
    },
    { label: 'TikTok', name: 'tiktok', type: 'text', initialValue: tiktok },
    { label: 'YouTube', name: 'youtube', type: 'text', initialValue: youtube },
    { label: 'X', name: 'x', type: 'text', initialValue: x },
  ];
};

export default editMemberFields;
