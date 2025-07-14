import React from 'react';
import { connect } from 'react-redux';
import { fetchMembers } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import { uploadImageToFirebase } from '../../utils/firebaseImage';
import { addMember } from '../../services/membersService';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';

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
    { label: 'Facebook', name: 'facebook', type: 'text', required: false },
    { label: 'Instagram', name: 'instagram', type: 'text', required: false },
    { label: 'TikTok', name: 'tiktok', type: 'text', required: false },
    { label: 'YouTube', name: 'youtube', type: 'text', required: false },
    { label: 'X', name: 'x', type: 'text', required: false },
  ];

  const [uploading, setUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

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
            onProgress: setUploadProgress,
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

  const modalProps = {
    id: 'add_modal',
    label: 'add_label',
    title: 'NEW MEMBER',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replaceAll('0', 'O')}%`
      : 'Add Member',
  };

  const AddButton = () => {
    return (
      <button
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        className='addButton btn btn-danger'
        type='button'
        disabled={uploading}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          className='bi bi-plus-square-fill'
          viewBox='0 0 16 16'
        >
          <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
        </svg>
        {modalProps.buttonText}
      </button>
    );
  };

  return (
    <>
      <CustomModal
        modalProps={modalProps}
        modalButton={<AddButton />}
      >
        <ModalForm
          fields={txtFields}
          onSubmit={onSubmit}
        />
      </CustomModal>
    </>
  );
};

export default connect(null, { fetchMembers })(AddMember);
