import React from 'react';
import { uploadImageToFirebase } from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { featuredReleaseFields } from './constants';
import { addFeaturedRelease as addFeaturedReleaseService } from '../../../services/featuredContentService';
import AddItem from '../../../components/Modifiers/AddItem';

const AddFeaturedRelease = ({ fetchReleases }) => {
  const { showError, showSuccess } = useAlert();

  const handleAdd = async (fields, setUploadProgress) => {
    try {
      let coverImageUrl = '';
      if (fields.coverImage && fields.coverImage[0]) {
        coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
          onProgress: setUploadProgress,
        });
      }
      const payload = {
        ...fields,
        coverImage: coverImageUrl,
        releaseDate: fields.releaseDate
          ? new Date(fields.releaseDate)
          : undefined,
      };
      await addFeaturedReleaseService(payload);
      showSuccess('Featured release added successfully');
      await fetchReleases();
    } catch (error) {
      showError('Failed to add featured release');
      throw error;
    }
  };

  return (
    <AddItem
      fields={featuredReleaseFields()}
      onAdd={handleAdd}
      buttonText='Add Featured Release'
      title='NEW FEATURED RELEASE'
      modalProps={{
        id: 'add_featured_release_modal',
        label: 'add_featured_release_modal',
      }}
    />
  );
};

export default AddFeaturedRelease;
