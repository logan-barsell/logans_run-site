import React from 'react';
import { uploadImageToFirebase } from '../../../utils/firebaseImage';
import { addShow } from '../../../services/showsManagementService';
import { useAlert } from '../../../contexts/AlertContext';
import { ADD_SHOW_FIELDS } from './constants';
import AddItem from '../../../components/Modifiers/AddItem';

const AddShow = ({ fetchShows }) => {
  const { showError, showSuccess } = useAlert();

  const onAdd = async (fields, setUploadProgress) => {
    try {
      let posterUrl = '';
      if (fields?.poster && fields?.poster?.[0]) {
        posterUrl = await uploadImageToFirebase(fields.poster[0], {
          onProgress: setUploadProgress,
        });
      } else {
        showError('Image required.');
        return;
      }
      const newShow = {
        ...fields,
        poster: posterUrl,
        date: fields.date.getTime(),
        doors: fields.doors.getTime(),
        showtime: fields.showtime.getTime(),
      };
      await addShow(newShow);
      showSuccess('Show added successfully!');
      fetchShows();
    } catch (err) {
      showError(err.message || 'Failed to add show');
    }
  };

  return (
    <AddItem
      fields={ADD_SHOW_FIELDS}
      onAdd={onAdd}
      buttonText='Add Show'
      title='NEW SHOW'
      modalProps={{ id: 'add_show_modal', label: 'add_show_modal' }}
    />
  );
};

export default AddShow;
