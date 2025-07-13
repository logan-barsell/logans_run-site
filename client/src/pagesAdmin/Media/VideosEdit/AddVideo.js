import React from 'react';
import ModalForm from '../../../components/Forms/ModalForm';
import CustomModal from '../../../components/Bootstrap/CustomModal';
import { addVideo } from '../../../services/mediaManagementService';
import { useAlert } from '../../../contexts/AlertContext';
import { addVideoFields } from './constants';

const AddVideo = ({ fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onSubmit = async ({ category, title, date, link }) => {
    try {
      const path = new URL(link).pathname;
      const embedLink = `https://www.youtube.com/embed${path}`;
      const newVideo = {
        category,
        title,
        date: date.getTime(),
        link,
        embedLink,
      };

      await addVideo(newVideo);
      showSuccess('Video added successfully');
      fetchVideos();
    } catch (error) {
      showError('Failed to add video');
    }
  };

  const modalProps = {
    id: 'add_video',
    label: 'add_video',
    title: 'NEW VIDEO',
    buttonText: 'Add Video',
  };

  const AddButton = () => {
    return (
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
  };

  return (
    <>
      <CustomModal
        modalProps={modalProps}
        modalButton={<AddButton />}
      >
        <ModalForm
          fields={addVideoFields}
          onSubmit={onSubmit}
        />
      </CustomModal>
    </>
  );
};

export default AddVideo;
