import React from 'react';
import { useSelector } from 'react-redux';
import EditItem from '../../../components/Modifiers/EditItem';
import { uploadImageAndReplace } from '../../../utils/firebase';
import { editShowFields } from './constants';
import { updateShow as updateShowService } from '../../../services/showsService';

const EditShow = ({ show, onSuccess, onError, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  const onEdit = async fields => {
    const id = show.id;
    try {
      let posterUrl = show.poster || '';

      // Only process image upload if a new file was actually selected
      if (
        fields.poster &&
        fields.poster[0] &&
        fields.poster[0] instanceof File
      ) {
        // Upload new image and replace old one
        posterUrl = await uploadImageAndReplace(fields.poster[0], show.poster, {
          tenantId,
        });
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
      onSuccess('Show updated successfully');
    } catch (err) {
      console.error(err);
      onError(err.message || 'Failed to update show');
    }
  };

  return (
    <EditItem
      key={`edit-show-${show.id}-${show.venue}-${show.location}-${show.doorprice}-${show.advprice}`}
      item={show}
      editFields={editShowFields}
      onEdit={onEdit}
      onClose={onClose}
      title='EDIT SHOW'
    />
  );
};

export default EditShow;
