import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { deleteShow as deleteShowService } from '../../../services/showsManagementService';

const DeleteShow = ({ show, shows, fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async id => {
    try {
      const showToDelete = shows.find(s => s._id === id);
      if (showToDelete && showToDelete.poster) {
        try {
          await deleteImageFromFirebase(showToDelete.poster);
        } catch (error) {
          console.error('Error deleting image from Firebase:', error);
        }
      }

      await deleteShowService(id);
      showSuccess('Show deleted successfully!');
      fetchShows();
    } catch (err) {
      showError(err.message || 'Failed to delete show');
    }
  };

  return (
    <DeleteItem
      item={show}
      variant='wide'
      buttonText='Remove'
      title='DELETE SHOW'
      content='Remove this show?'
      onDelete={onDelete}
    />
  );
};

export default DeleteShow;
