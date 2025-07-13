import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { useAlert } from '../../../contexts/AlertContext';
import { deleteFeaturedVideo as deleteFeaturedVideoService } from '../../../services/featuredContentService';

const DeleteFeaturedVideo = ({ video, fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async id => {
    try {
      await deleteFeaturedVideoService(id);
      showSuccess('Featured video deleted successfully!');
      fetchVideos();
    } catch (err) {
      console.log(err);
      showError(err.message || 'Failed to delete featured video');
    }
  };

  return (
    <DeleteItem
      item={video}
      variant='wide'
      buttonText='Remove'
      title='DELETE FEATURED VIDEO'
      content='Remove featured video?'
      onDelete={onDelete}
    />
  );
};

export default DeleteFeaturedVideo;
