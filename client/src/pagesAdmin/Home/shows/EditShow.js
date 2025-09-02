import React from 'react';
import EditItem from '../../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import { useAlert } from '../../../contexts/AlertContext';
import { editShowFields } from './constants';
import { updateShow as updateShowService } from '../../../services/showsService';

const EditShow = ({ show, fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    const id = show._id;
    try {
      let posterUrl = show.poster || '';

      // Only process image upload if a new file was actually selected
      if (
        fields.poster &&
        fields.poster[0] &&
        fields.poster[0] instanceof File
      ) {
        // Delete old image if it exists
        if (show.poster) {
          try {
            await deleteImageFromFirebase(show.poster);
          } catch (imageError) {
            console.warn(
              'Failed to delete old image from Firebase:',
              imageError
            );
            // Continue with upload even if old image deletion fails
          }
        }
        // Upload new image
        posterUrl = await uploadImageToFirebase(fields.poster[0]);
      }

      const updatedShow = {
        id,
        poster: posterUrl,
        venue: fields.venue,
        location: fields.location,
        date: fields.date.getTime(),
        doors: fields.doors.getTime(),
        showtime: fields.showtime.getTime(),
        doorprice: fields.doorprice,
        advprice: fields.advprice,
        tixlink: fields.tixlink,
      };

      await updateShowService(id, updatedShow);
      showSuccess('Show updated successfully!');

      // Fetch updated shows data
      fetchShows();
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to update show');
    }
  };

  return (
    <EditItem
      key={`edit-show-${show._id}-${show.venue}-${show.location}-${show.doorprice}-${show.advprice}`} // Force re-render when show data changes
      item={show}
      editFields={editShowFields}
      onEdit={onEdit}
      title='EDIT SHOW'
    />
  );
};

export default EditShow;
