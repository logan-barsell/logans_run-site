import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteVideoFromFirebase } from '../../../utils/firebase';
import { deleteFeaturedVideo as deleteFeaturedVideoService } from '../../../services/featuredContentService';

const DeleteFeaturedVideo = ({ video, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
    try {
      // Try to delete video file, but don't fail the entire operation if it fails
      if (video && video.videoFile && video.videoType === 'upload') {
        try {
          await deleteVideoFromFirebase(video.videoFile);
        } catch (videoError) {
          console.warn('Failed to delete video from Firebase:', videoError);
          // Continue with record deletion even if video deletion fails
        }
      }

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
