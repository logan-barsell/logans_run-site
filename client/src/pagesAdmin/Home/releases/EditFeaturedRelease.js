import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredReleaseFields } from './constants';
import { updateFeaturedRelease } from '../../../services/featuredContentService';

const EditFeaturedRelease = ({ release, fetchReleases }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    try {
      let newImageUrl;
      let oldImageUrl = release.coverImage;
      if (fields.coverImage && fields.coverImage[0]) {
        // Delete old image if exists
        if (oldImageUrl) {
          await deleteImageFromFirebase(oldImageUrl);
        }
        newImageUrl = await uploadImageToFirebase(fields.coverImage[0]);
      }
      const payload = {
        ...fields,
        coverImage: newImageUrl,
        releaseDate: fields.releaseDate
          ? new Date(fields.releaseDate)
          : undefined,
      };
      const id = release._id || release.id;
      await updateFeaturedRelease(id, payload);
      showSuccess('Featured release updated successfully');
      fetchReleases();
    } catch (error) {
      showError('Failed to update featured release');
    }
  };

  return (
    <EditItem
      item={release}
      editFields={featuredReleaseFields}
      onEdit={onEdit}
      variant='wide'
      buttonText='Edit'
      title='EDIT FEATURED RELEASE'
    />
  );
};

export default EditFeaturedRelease;
