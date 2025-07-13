import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredVideoFields } from './constants';
import { updateFeaturedVideo } from '../../../services/featuredContentService';

const EditFeaturedVideo = ({ video, fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    try {
      const payload = { ...fields };
      if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
        payload.releaseDate = new Date(payload.releaseDate);
      }
      const id = video._id || video.id;
      await updateFeaturedVideo(id, payload);
      showSuccess('Featured video updated successfully!');
      fetchVideos();
    } catch (err) {
      showError(err.message || 'Failed to update featured video');
    }
  };

  return (
    <EditItem
      item={video}
      editFields={featuredVideoFields}
      onEdit={onEdit}
      variant='wide'
      buttonText='Edit'
      title='EDIT FEATURED VIDEO'
    />
  );
};

export default EditFeaturedVideo;
