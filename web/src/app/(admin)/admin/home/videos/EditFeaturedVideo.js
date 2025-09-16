'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { featuredVideoFields } from './constants';
import { updateFeaturedVideo } from '../../../../../services/featuredContentService';
import {
  uploadVideoAndReplace,
  deleteVideoFromFirebase,
} from '../../../../../lib/firebase';
import EditItem from '../../../../../components/Modifiers/EditItem';

const EditFeaturedVideo = ({ video, onSuccess, onError, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  const handleEdit = async values => {
    try {
      let payload = { ...values };

      // Handle video upload if video type is 'upload' and new file is selected
      if (values.videoType === 'upload' && values.videoFile) {
        const videoFile = values.videoFile[0];
        const videoUrl = await uploadVideoAndReplace(
          videoFile,
          video.videoFile,
          { tenantId }
        );
        payload.videoFile = videoUrl;
        payload.videoType = 'upload';
      } else if (values.videoType === 'youtube') {
        // Clean up video file if switching from upload to youtube
        if (video.videoFile) {
          try {
            await deleteVideoFromFirebase(video.videoFile);
          } catch (error) {
            console.warn('Failed to delete old video:', error);
          }
        }
        payload.videoFile = null;
        payload.videoType = 'youtube';
      } else {
        // Keep existing video type and file
        payload.videoType = values.videoType || video.videoType || 'youtube';
        payload.videoFile = video.videoFile || null;
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

      const id = video.id;
      await updateFeaturedVideo(id, payload);
      onSuccess('Featured video updated successfully');
    } catch (err) {
      onError(err.message || 'Failed to update featured video');
      throw err; // Re-throw to prevent modal from closing
    }
  };

  const editFields = videoData => featuredVideoFields(videoData);

  return (
    <EditItem
      item={{ data: video }}
      editFields={editFields}
      onEdit={handleEdit}
      onClose={onClose}
      title='EDIT FEATURED VIDEO'
      variant='wide'
      buttonText='Edit'
    />
  );
};

export default EditFeaturedVideo;
