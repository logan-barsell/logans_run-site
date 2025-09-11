import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../utils/firebase';
import { deleteFeaturedRelease as deleteFeaturedReleaseService } from '../../../services/featuredContentService';

const DeleteFeaturedRelease = ({ release, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
    try {
      // Try to delete image, but don't fail the entire operation if it fails
      if (release.coverImage) {
        try {
          await deleteImageFromFirebase(release.coverImage);
        } catch (imageError) {
          console.warn('Failed to delete image from Firebase:', imageError);
          // Continue with record deletion even if image deletion fails
        }
      }

      await deleteFeaturedReleaseService(id);
      onSuccess('Featured release deleted successfully');
    } catch (error) {
      onError('Failed to delete featured release');
    }
  };

  return (
    <DeleteItem
      item={release}
      variant='wide'
      buttonText='Remove'
      title='DELETE FEATURED RELEASE'
      content={
        <>
          Remove <span>{release.title}</span> from featured releases?
        </>
      }
      onDelete={onDelete}
      onClose={onClose}
    />
  );
};

export default DeleteFeaturedRelease;
