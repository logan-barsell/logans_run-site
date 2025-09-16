'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { featuredVideoFields } from './constants';
import { addFeaturedVideo as addFeaturedVideoService } from '../../../../../services/featuredContentService';
import { uploadVideoToFirebase } from '../../../../../lib/firebase';
import AddItem from '../../../../../components/Modifiers/AddItem';
import Button from '../../../../../components/Button/Button.jsx';
import { PlusSquareFill } from '../../../../../components/icons';

const AddFeaturedVideo = ({ onSuccess, onError, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  const handleAdd = async values => {
    try {
      let payload = { ...values };

      // Handle video upload if video type is 'upload'
      if (values.videoType === 'upload' && values.videoFile) {
        const videoFile = values.videoFile[0];
        const videoUrl = await uploadVideoToFirebase(videoFile, { tenantId });
        payload.videoFile = videoUrl;
        payload.videoType = 'upload';
      } else {
        payload.videoType = 'youtube';
      }

      // Handle release date
      if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
        payload.releaseDate = new Date(payload.releaseDate);
      }

      // Handle startTime and endTime - convert empty strings to null, valid strings to integers
      payload.startTime =
        payload.startTime === '' ? null : parseInt(payload.startTime) || null;
      payload.endTime =
        payload.endTime === '' ? null : parseInt(payload.endTime) || null;

      await addFeaturedVideoService(payload);
      onSuccess('Featured video added successfully!');
    } catch (err) {
      onError(err.message || 'Failed to add featured video');
      throw err; // Re-throw to prevent modal from closing
    }
  };

  const fields = featuredVideoFields();

  return (
    <AddItem
      fields={fields}
      onAdd={handleAdd}
      onClose={onClose}
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
