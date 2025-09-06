import React from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredVideoFields } from './constants';
import { addFeaturedVideo as addFeaturedVideoService } from '../../../services/featuredContentService';
import { uploadVideoToFirebase } from '../../../utils/firebaseVideo';
import AddItem from '../../../components/Modifiers/AddItem';
import Button from '../../../components/Button/Button';
import { PlusSquareFill } from '../../../components/icons';

const AddFeaturedVideo = ({ fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const handleAdd = async values => {
    try {
      let payload = { ...values };

      // Handle video upload if video type is 'upload'
      if (values.videoType === 'upload' && values.videoFile) {
        const videoFile = values.videoFile[0];
        const videoUrl = await uploadVideoToFirebase(videoFile);
        payload.videoFile = videoUrl;
        payload.videoType = 'upload';
      } else {
        payload.videoType = 'youtube';
      }

      // Handle release date
      if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
        payload.releaseDate = new Date(payload.releaseDate);
      }

      await addFeaturedVideoService(payload);
      showSuccess('Featured video added successfully!');
      fetchVideos();
    } catch (err) {
      showError(err.message || 'Failed to add featured video');
      throw err; // Re-throw to prevent modal from closing
    }
  };

  const fields = featuredVideoFields();

  return (
    <AddItem
      fields={fields}
      onAdd={handleAdd}
      title='ADD FEATURED VIDEO'
      buttonText='Add Featured Video'
      modalProps={{
        id: 'add_featured_video_modal',
        label: 'add_featured_video_modal',
      }}
      modalButton={
        <Button
          variant='danger'
          icon={<PlusSquareFill />}
          data-bs-toggle='modal'
          data-bs-target='#add_featured_video_modal'
          type='button'
          className='addButton'
        >
          Add Featured Video
        </Button>
      }
    />
  );
};

export default AddFeaturedVideo;
