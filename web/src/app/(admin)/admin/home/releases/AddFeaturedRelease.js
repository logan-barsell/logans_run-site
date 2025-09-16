'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { uploadImageToFirebase } from '../../../../../lib/firebase';
import { featuredReleaseFields } from './constants';
import { addFeaturedRelease as addFeaturedReleaseService } from '../../../../../services/featuredContentService';
import AddItem from '../../../../../components/Modifiers/AddItem';
import Button from '../../../../../components/Button/Button.jsx';
import { PlusSquareFill } from '../../../../../components/icons';

const AddFeaturedRelease = ({ onSuccess, onError, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  const handleAdd = async fields => {
    try {
      let coverImageUrl = '';
      if (fields.coverImage && fields.coverImage[0]) {
        coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
          tenantId,
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
