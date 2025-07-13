import React from 'react';
import ModalForm from '../../../components/Forms/ModalForm';
import CustomModal from '../../../components/Bootstrap/CustomModal';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredVideoFields } from './constants';
import { addFeaturedVideo as addFeaturedVideoService } from '../../../services/featuredContentService';

const AddFeaturedVideo = ({ fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const modalProps = {
    id: 'add_featured_video',
    label: 'add_featured_video',
    title: 'NEW FEATURED VIDEO',
    buttonText: 'Add Featured Video',
  };

  const onSubmit = async fields => {
    try {
      const payload = { ...fields };
      if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
        payload.releaseDate = new Date(payload.releaseDate);
      }
      await addFeaturedVideoService(payload);
      showSuccess('Featured video added successfully!');
      fetchVideos();
    } catch (err) {
      showError(err.message || 'Failed to add featured video');
    }
  };

  const AddButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='addButton btn btn-danger'
      type='button'
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
        fields={featuredVideoFields()}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

export default AddFeaturedVideo;
