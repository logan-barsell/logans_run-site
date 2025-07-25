import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { deleteFeaturedRelease as deleteFeaturedReleaseService } from '../../../services/featuredContentService';

const DeleteFeaturedRelease = ({ release, fetchReleases }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async item => {
    const id = item._id || item.id;
    try {
      if (release.coverImage) {
        await deleteImageFromFirebase(release.coverImage);
      }
      await deleteFeaturedReleaseService(id);
      showSuccess('Featured release deleted successfully');
      fetchReleases();
    } catch (error) {
      showError('Failed to delete featured release');
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
    />
  );
};

export default DeleteFeaturedRelease;
