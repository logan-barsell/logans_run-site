import React from 'react';
import { uploadImageToFirebase } from '../../../utils/firebase';
import { featuredReleaseFields } from './constants';
import { addFeaturedRelease as addFeaturedReleaseService } from '../../../services/featuredContentService';
import AddItem from '../../../components/Modifiers/AddItem';
import Button from '../../../components/Button/Button';
import { PlusSquareFill } from '../../../components/icons';

const AddFeaturedRelease = ({ onSuccess, onError, onClose }) => {
  const handleAdd = async (fields, setUploadProgress) => {
    try {
      let coverImageUrl = '';
      if (fields.coverImage && fields.coverImage[0]) {
        coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
          onProgress: () => {}, // Pass empty function instead of progress tracking
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
      onSuccess('Featured release added successfully');
    } catch (error) {
      onError('Failed to add featured release');
      throw error;
    }
  };

  return (
    <AddItem
      fields={featuredReleaseFields()}
      onAdd={handleAdd}
      onClose={onClose}
      title='NEW FEATURED RELEASE'
      modalProps={{
        id: 'add_featured_release_modal',
        label: 'add_featured_release_modal',
      }}
      modalButton={
        <Button
          variant='danger'
          icon={<PlusSquareFill />}
          type='button'
          className='addButton'
        >
          Add Featured Release
        </Button>
      }
    />
  );
};

export default AddFeaturedRelease;
