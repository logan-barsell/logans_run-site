import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import { uploadImageAndReplace } from '../../../utils/firebase';
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
        // Upload new image and replace old one
        newImageUrl = await uploadImageAndReplace(
          fields.coverImage[0],
          oldImageUrl
        );
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
