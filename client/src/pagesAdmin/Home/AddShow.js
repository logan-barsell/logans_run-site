import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchShows } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import ADD_SHOW_FIELDS from './addShowFields';
import { uploadImageToFirebase } from '../../utils/firebaseImage';

const AddShow = ({ fetchShows }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmit = async ({
    poster,
    venue,
    location,
    date,
    doors,
    showtime,
    doorprice,
    advprice,
    tixlink,
  }) => {
    setUploading(true);
    const newDate = date.getTime();
    const newDoors = doors.getTime();
    const newShowtime = showtime.getTime();

    let posterUrl = '';
    if (poster && poster[0]) {
      try {
        posterUrl = await uploadImageToFirebase(poster[0], {
          onProgress: setUploadProgress,
        });
      } catch (err) {
        setUploading(false);
        throw err;
      }
    }

    const newShow = {
      poster: posterUrl,
      venue,
      location,
      date: newDate,
      doors: newDoors,
      showtime: newShowtime,
      doorprice,
      advprice,
      tixlink,
    };

    axios.post('/api/addShow', newShow).then(res => {
      fetchShows();
      setUploading(false);
    });
  };

  const modalProps = {
    id: 'add_show',
    label: 'show_label',
    title: 'NEW SHOW',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replaceAll('0', 'O')}%`
      : 'Add Show',
  };

  const AddButton = () => {
    return (
      <button
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        className='addButton btn btn-danger'
        type='button'
        disabled={uploading}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          className='bi bi-plus-square-fill'
          viewBox='0 0 16 16'
        >
          <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
        </svg>
        {modalProps.buttonText}
      </button>
    );
  };

  return (
    <>
      <CustomModal
        modalProps={modalProps}
        modalButton={<AddButton />}
      >
        <ModalForm
          fields={ADD_SHOW_FIELDS}
          onSubmit={onSubmit}
        />
      </CustomModal>
    </>
  );
};

function mapStateToProps({ shows }) {
  return { shows };
}

export default connect(mapStateToProps, { fetchShows })(AddShow);
