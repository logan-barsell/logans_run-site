import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import { editVideoFields } from './constants';
import { updateVideo } from '../../../services/mediaService';

const EditVideo = ({ video, onSuccess, onError, onClose }) => {
  const onEdit = async fields => {
    try {
      const path = new URL(fields.link).pathname;
      const embedLink = `https://www.youtube.com/embed${path}`;
      const updatedVideo = {
        id: video.id,
        ...fields,
        embedLink,
      };

      await updateVideo(updatedVideo);
      onSuccess('Video updated successfully');
    } catch (err) {
      onError(err.message || 'Failed to update video');
    }
  };

  return (
    <EditItem
      item={video}
      editFields={editVideoFields}
      onEdit={onEdit}
      onClose={onClose} // NEW: pass the close callback
      variant='wide'
      buttonText='Edit'
      title='EDIT VIDEO'
    />
  );
};

export default EditVideo;
