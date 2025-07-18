import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import { useAlert } from '../../../contexts/AlertContext';
import { editVideoFields } from './constants';
import { updateVideo } from '../../../services/mediaManagementService';

const EditVideo = ({ video, fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    try {
      const path = new URL(fields.link).pathname;
      const embedLink = `https://www.youtube.com/embed${path}`;
      const updatedVideo = {
        _id: video._id,
        ...fields,
        embedLink,
      };

      await updateVideo(updatedVideo);
      showSuccess('Video updated successfully');
      fetchVideos();
    } catch (err) {
      showError('Failed to update video');
    }
  };

  return (
    <EditItem
      item={video}
      editFields={editVideoFields}
      onEdit={onEdit}
      variant='wide'
      buttonText='Edit'
      title='EDIT VIDEO'
    />
  );
};

export default EditVideo;
