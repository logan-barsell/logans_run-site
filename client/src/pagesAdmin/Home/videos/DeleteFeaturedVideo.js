import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteFeaturedVideo as deleteFeaturedVideoService } from '../../../services/featuredContentService';

const DeleteFeaturedVideo = ({ video, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
    try {
      await deleteFeaturedVideoService(id);
      onSuccess('Featured video deleted successfully!');
    } catch (err) {
      onError(err.message || 'Failed to delete featured video');
    }
  };

  return (
    <DeleteItem
      item={video}
      variant='wide'
      buttonText='Remove'
      title='DELETE FEATURED VIDEO'
      content={
        <>
          Remove <span>{video.title}</span> from featured videos?
        </>
      }
      onDelete={onDelete}
      onClose={onClose}
    />
  );
};

export default DeleteFeaturedVideo;
