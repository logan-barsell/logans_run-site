import React from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredVideoFields } from './constants';
import { addFeaturedVideo as addFeaturedVideoService } from '../../../services/featuredContentService';
import AddItem from '../../../components/Modifiers/AddItem';

const AddFeaturedVideo = ({ fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onAdd = async fields => {
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

  return (
    <AddItem
      fields={featuredVideoFields()}
      onAdd={onAdd}
      buttonText='Add Featured Video'
      title='NEW FEATURED VIDEO'
      modalProps={{
        id: 'add_featured_video_modal',
        label: 'add_featured_video_modal',
      }}
    />
  );
};

export default AddFeaturedVideo;
