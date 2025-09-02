import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { useAlert } from '../../../contexts/AlertContext';
import { deleteVideo as deleteVideoService } from '../../../services/mediaService';

const DeleteVideo = ({ video, fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async item => {
    const id = item._id || item.id;
    try {
      await deleteVideoService(id);
      showSuccess('Video deleted successfully');
      fetchVideos();
    } catch (err) {
      showError('Failed to delete video');
    }
  };

  return (
    <DeleteItem
      item={video}
      variant='wide'
      buttonText='Remove'
      title='DELETE VIDEO'
      content='Remove video from media?'
      onDelete={onDelete}
    />
  );
};

export default DeleteVideo;
