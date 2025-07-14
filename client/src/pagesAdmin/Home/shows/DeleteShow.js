import React from 'react';
import DeleteItem from '../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { deleteShow as deleteShowService } from '../../../services/showsManagementService';

const DeleteShow = ({ show, fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async item => {
    const id = item._id || item.id;
    try {
      if (show && show.poster) {
        await deleteImageFromFirebase(show.poster);
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
      title='DELETE SHOW'
      content={
        <>
          Remove <span>{show.venue}</span> from shows?
        </>
      }
      onDelete={onDelete}
    />
  );
};

export default DeleteShow;
