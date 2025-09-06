import React from 'react';
import { connect } from 'react-redux';
import { fetchMembers } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import BaseModal from '../../components/Modals/BaseModal';
import { uploadImageToFirebase } from '../../utils/firebaseImage';
import { addMember } from '../../services/membersService';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';
import { PlusSquareFill } from '../../components/icons';
import Button from '../../components/Button/Button';

const AddMember = ({ fetchMembers }) => {
  const { showError, showSuccess } = useAlert();
  const txtFields = [
    {
      label: 'Upload Image',
      name: 'bioPic',
      type: 'image',
      required: true,
    },
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Role', name: 'role', type: 'text' },
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

  const [uploading, setUploading] = React.useState(false);

  const onSubmit = async values => {
    try {
      setUploading(true);
      let imageUrl = '';
      let fileName = '';
      if (values.bioPic && values.bioPic.length) {
        try {
          fileName = Date.now() + values.bioPic[0].name;
          imageUrl = await uploadImageToFirebase(values.bioPic[0], {
            fileName,
            onProgress: () => {}, // Pass empty function instead of setUploadProgress
          });
        } catch (err) {
          setUploading(false);
          throw err;
        }
      }
      // Ensure all social fields are present and normalize URLs
      const socials = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'];
      for (const key of socials) {
        if (typeof values[key] === 'undefined') {
          values[key] = '';
        }
      }
      const newMember = {
        bioPic: imageUrl,
        name: values.name,
        role: values.role,
        facebook: normalizeUrl(values.facebook),
        instagram: normalizeUrl(values.instagram),
        tiktok: normalizeUrl(values.tiktok),
        youtube: normalizeUrl(values.youtube),
        x: normalizeUrl(values.x),
      };
      await addMember(newMember);
      showSuccess('Member added successfully');
      fetchMembers();
      setUploading(false);
    } catch (error) {
      showError('Failed to add member');
      setUploading(false);
    }
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    // Modal will be closed automatically by BaseModal
  };

  return (
    <BaseModal
      id='add_member_modal'
      title='NEW MEMBER'
      trigger={
        <Button
          className='addButton'
          variant='danger'
          type='button'
          disabled={uploading}
          loading={uploading}
          icon={<PlusSquareFill />}
          iconPosition='left'
        >
          {uploading ? 'Uploading...' : 'Add Member'}
        </Button>
      }
      onSuccess={handleFormSuccess}
    >
      <ModalForm
        fields={txtFields}
        onSubmit={onSubmit}
        onSuccess={handleFormSuccess}
      />
    </BaseModal>
  );
};

export default connect(null, { fetchMembers })(AddMember);
