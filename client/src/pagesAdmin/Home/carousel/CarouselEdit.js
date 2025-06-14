import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../redux/actions';
import axios from 'axios';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from '../../firebase';
import { Form } from 'react-final-form';
import { ImageUpload } from '../../../components/Forms/FieldTypes';
import RemoveImage from './RemoveImage';

const CarouselEdit = ({ fetchHomeImages, images }) => {
  const storage = getStorage(app);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const onSubmit = data => {
    const file = data?.pic[0];
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    setUploading(true);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.floor(progress));
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
        }
      },
      error => {
        console.log(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          const payload = { name: fileName, imgLink: downloadURL };
          axios
            .post('/api/addHomeImage', payload)
            .then(res => {
              setUploading(false);
              fetchHomeImages();
            })
            .catch(err => console.log(err));
        });
      }
    );
  };

  const onFormRestart = form => {
    form.restart();
    document.querySelector('.upload').value = null;
  };

  const removeImage = image => {
    axios
      .get(`/api/removeImage/${image._id}`)
      .then(res => {
        const desertRef = ref(storage, image.name);
        deleteObject(desertRef)
          .then(() => {})
          .catch(error => {
            console.log(error);
          });
        fetchHomeImages();
      })
      .catch(err => console.log(err));
  };

  return (
    <div
      id='editCarousel'
      className='container'
    >
      <h3>Home Page</h3>
      <hr />
      <div className='currentImages'>
        {images.length > 0 ? (
          images.map(image => (
            <div
              key={image._id}
              className='img-container'
            >
              <RemoveImage
                item={image}
                onDelete={removeImage}
              />
              <img
                src={image.imgLink}
                alt='carousel'
              />
            </div>
          ))
        ) : (
          <h3 className='no-content'>No Images</h3>
        )}
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, meta }) => (
          <form
            onSubmit={async event => {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              onFormRestart(form);
            }}
          >
            <ImageUpload name='pic' />
            <div className='d-grid gap-2'>
              <button
                disabled={uploading}
                className='submit btn btn-danger mt-3'
              >
                {uploading
                  ? `Uploading... ${uploadProgress}%`
                  : 'Add to Images'}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

function mapStateToProps({ carouselImages }) {
  return { images: carouselImages };
}

export default connect(mapStateToProps, { fetchHomeImages })(CarouselEdit);
