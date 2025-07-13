import React, { useState } from 'react';
import ModalForm from '../../../components/Forms/ModalForm';
import CustomModal from '../../../components/Bootstrap/CustomModal';
import { uploadImageToFirebase } from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredReleaseFields } from './constants';

const AddFeaturedRelease = ({ onAdd }) => {
  const { showError, showSuccess } = useAlert();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmit = async fields => {
    try {
      setUploading(true);
      let coverImageUrl = '';
      if (fields.coverImage && fields.coverImage[0]) {
        coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
          onProgress: setUploadProgress,
        });
      }
      const payload = {
        ...fields,
        coverImage: coverImageUrl,
        releaseDate: fields.releaseDate
          ? new Date(fields.releaseDate)
          : undefined,
      };
      await onAdd(payload);
      showSuccess('Featured release added successfully');
      setUploading(false);
    } catch (error) {
      showError('Failed to add featured release');
      setUploading(false);
    }
  };

  const modalProps = {
    id: 'add_featured_release',
    label: 'add_featured_release',
    title: 'NEW FEATURED RELEASE',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replace('0', 'O')}%`
      : 'Add Featured Release',
  };

  const AddButton = () => (
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

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<AddButton />}
    >
      <ModalForm
        fields={featuredReleaseFields()}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

export default AddFeaturedRelease;
