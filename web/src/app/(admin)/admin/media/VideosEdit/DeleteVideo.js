'use client';

import React from 'react';
import DeleteItem from '../../../../../components/Modifiers/DeleteItem';
import { deleteVideo as deleteVideoService } from '../../../../../services/mediaService';

const DeleteVideo = ({ video, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
    try {
      await deleteVideoService(id);
      onSuccess('Video deleted successfully');
    } catch (err) {
      onError('Failed to delete video');
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
      onClose={onClose} // NEW: pass the close callback
    />
  );
};

export default DeleteVideo;
