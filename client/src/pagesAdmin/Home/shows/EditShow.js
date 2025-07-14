import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { editShowFields } from './constants';
import { updateShow as updateShowService } from '../../../services/showsManagementService';

const EditShow = ({ show, fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    const id = show._id;
    try {
      let posterUrl = show.poster || '';
      if (fields.poster && fields.poster[0]) {
        // Delete old image if it exists
        if (show.poster) {
          await deleteImageFromFirebase(show.poster);
        }
        // Upload new image
        posterUrl = await uploadImageToFirebase(fields.poster[0]);
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
      console.error(err);
      showError(err.message || 'Failed to update show');
    }
  };

  return (
    <EditItem
      item={show}
      editFields={editShowFields}
      onEdit={onEdit}
      title='EDIT SHOW'
    />
  );
};

export default EditShow;
