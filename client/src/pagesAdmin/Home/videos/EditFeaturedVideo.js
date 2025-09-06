import React from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredVideoFields } from './constants';
import { updateFeaturedVideo } from '../../../services/featuredContentService';
import {
  uploadVideoToFirebase,
  safeDeleteVideoFromFirebase,
} from '../../../utils/firebaseVideo';
import EditItem from '../../../components/Modifiers/EditItem';

const EditFeaturedVideo = ({ video, fetchVideos }) => {
  const { showError, showSuccess } = useAlert();

  const handleEdit = async values => {
    try {
      let payload = { ...values };

      // Handle video upload if video type is 'upload' and new file is selected
      if (values.videoType === 'upload' && values.videoFile) {
        // Delete old video file if it exists
        if (video.videoFile) {
          await safeDeleteVideoFromFirebase(video.videoFile);
        }

        const videoFile = values.videoFile[0];
        const videoUrl = await uploadVideoToFirebase(videoFile);
        payload.videoFile = videoUrl;
        payload.videoType = 'upload';
      } else if (values.videoType === 'youtube') {
        // Clean up video file if switching from upload to youtube
        if (video.videoFile) {
          await safeDeleteVideoFromFirebase(video.videoFile);
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

      const id = video._id || video.id;
      await updateFeaturedVideo(id, payload);
      showSuccess('Featured video updated successfully!');
      fetchVideos();
    } catch (err) {
      showError(err.message || 'Failed to update featured video');
      throw err; // Re-throw to prevent modal from closing
    }
  };

  const editFields = videoData => featuredVideoFields(videoData);

  return (
    <EditItem
      item={{ data: video }}
      editFields={editFields}
      onEdit={handleEdit}
      title='EDIT FEATURED VIDEO'
      variant='wide'
      buttonText='Edit'
    />
  );
};

export default EditFeaturedVideo;
