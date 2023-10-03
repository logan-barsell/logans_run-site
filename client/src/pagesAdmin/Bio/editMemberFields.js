export default (member) => {
  const { bioPic, name, role, instaTag } = member;
  return [
    {
      label: 'Upload Image',
      name: 'bioPic',
      type: 'image',
      initialValue: bioPic
    },
    { label: 'Name', name: 'name', type: 'text', initialValue: name },
    { label: 'Role', name: 'role', type: 'text', initialValue: role },
    { label: 'Instagram Tag', name: 'instaTag', type: 'text', initialValue: instaTag }
  ];
}