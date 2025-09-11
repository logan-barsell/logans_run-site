import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../utils/firebaseImage';
import { deleteShow as deleteShowService } from '../../../services/showsService';

const DeleteShow = ({ show, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
    try {
      // Try to delete image, but don't fail the entire operation if it fails
      if (show && show.poster) {
        try {
          await deleteImageFromFirebase(show.poster);
        } catch (imageError) {
          console.warn('Failed to delete image from Firebase:', imageError);
          // Continue with record deletion even if image deletion fails
        }
      }

      await deleteShowService(id);
      onSuccess('Show deleted successfully!');
    } catch (err) {
      onError(err.message || 'Failed to delete show');
    }
  };

  return (
    <DeleteItem
      item={show}
      title='DELETE SHOW'
      content={
        <>
          Remove <span>{show.venue}</span> from shows?
        </>
      }
      onDelete={onDelete}
      onClose={onClose}
    />
  );
};

export default DeleteShow;
