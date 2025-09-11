import React from 'react';
import { uploadImageToFirebase } from '../../../utils/firebaseImage';
import { addShow } from '../../../services/showsService';
import { ADD_SHOW_FIELDS } from './constants';
import AddItem from '../../../components/Modifiers/AddItem';
import Button from '../../../components/Button/Button';
import { PlusSquareFill } from '../../../components/icons';

const AddShow = ({ onSuccess, onError, onClose }) => {
  const onAdd = async (fields, setUploadProgress) => {
    try {
      let posterUrl = '';
      if (fields?.poster && fields?.poster?.[0]) {
        posterUrl = await uploadImageToFirebase(fields.poster[0], {
          onProgress: () => {}, // Pass empty function instead of progress tracking
        });
      } else {
        onError('Image required.');
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
      onSuccess('Show added successfully!');
    } catch (err) {
      onError(err.message || 'Failed to add show');
    }
  };

  return (
    <AddItem
      fields={ADD_SHOW_FIELDS}
      onAdd={onAdd}
      onClose={onClose}
      title='NEW SHOW'
      modalProps={{ id: 'add_show_modal', label: 'add_show_modal' }}
      modalButton={
        <Button
          variant='danger'
          icon={<PlusSquareFill />}
          type='button'
          className='addButton'
        >
          Add Show
        </Button>
      }
    />
  );
};

export default AddShow;
