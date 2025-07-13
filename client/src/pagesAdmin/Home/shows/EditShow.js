import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { editShowFields } from './constants';
import { updateShow as updateShowService } from '../../../services/showsManagementService';

const EditShow = ({ show, shows, fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async (id, fields) => {
    try {
      const currentShow = shows.find(s => s._id === id);
      let posterUrl = currentShow.poster || '';

      if (fields.poster && fields.poster[0]) {
        // Delete old image if it exists
        if (currentShow.poster) {
          try {
            await deleteImageFromFirebase(currentShow.poster);
          } catch (error) {
            console.error('Error deleting old image from Firebase:', error);
          }
        }

        // Upload new image
        try {
          posterUrl = await uploadImageToFirebase(fields.poster[0]);
        } catch (err) {
          showError('Failed to upload show poster');
          throw err;
        }
      }

      const updatedShow = {
        id,
        poster: posterUrl,
        venue: fields.venue,
        location: fields.location,
        date: fields.date,
        doors: fields.doors,
        showtime: fields.showtime,
        doorprice: fields.doorprice,
        advprice: fields.advprice,
        tixlink: fields.tixlink,
      };

      await updateShowService(id, updatedShow);
      showSuccess('Show updated successfully!');
      fetchShows();
    } catch (err) {
      showError(err.message || 'Failed to update show');
    }
  };

  return (
    <EditItem
      item={show}
      editFields={editShowFields}
      onEdit={onEdit}
      variant='wide'
      buttonText='Edit'
      title='EDIT SHOW'
    />
  );
};

export default EditShow;
