import React from 'react';
import { addVideo } from '../../../services/mediaManagementService';
import { useAlert } from '../../../contexts/AlertContext';
import { addVideoFields } from './constants';
import AddItem from '../../../components/Modifiers/AddItem';

const AddVideo = ({ fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const onAdd = async ({ category, title, date, link }) => {
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

  return (
    <AddItem
      fields={addVideoFields}
      onAdd={onAdd}
      buttonText='Add Video'
      title='NEW VIDEO'
      modalProps={{ id: 'add_video_modal', label: 'add_video_modal' }}
    />
  );
};

export default AddVideo;
