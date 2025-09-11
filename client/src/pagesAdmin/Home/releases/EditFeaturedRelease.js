import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebase';
import { featuredReleaseFields } from './constants';
import { updateFeaturedRelease } from '../../../services/featuredContentService';

const EditFeaturedRelease = ({ release, onSuccess, onError, onClose }) => {
  const onEdit = async fields => {
    try {
      let newImageUrl = release.coverImage; // Keep existing image by default
      let oldImageUrl = release.coverImage;

      // Only process image upload if a new file was actually selected
      if (
        fields.coverImage &&
        fields.coverImage[0] &&
        fields.coverImage[0] instanceof File
      ) {
        // Delete old image if exists
        if (oldImageUrl) {
          try {
            await deleteImageFromFirebase(oldImageUrl);
          } catch (imageError) {
            console.warn(
              'Failed to delete old image from Firebase:',
              imageError
            );
            // Continue with upload even if old image deletion fails
          }
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
      const id = release.id;
      await updateFeaturedRelease(id, payload);
      onSuccess('Featured release updated successfully');
    } catch (error) {
      onError(error.message || 'Failed to update featured release');
    }
  };

  return (
    <EditItem
      item={release}
      editFields={featuredReleaseFields}
      onEdit={onEdit}
      onClose={onClose}
      variant='wide'
      buttonText='Edit'
      title='EDIT FEATURED RELEASE'
    />
  );
};

export default EditFeaturedRelease;
