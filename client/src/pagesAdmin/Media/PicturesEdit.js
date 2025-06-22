import './picturesEdit.css';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import axios from 'axios';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import app from '../firebase';
import { Form } from 'react-final-form';
import { ImageUpload } from '../../components/Forms/FieldTypes';
import RemoveImage from './RemoveImage';

const imgCount = 12;
const PicturesEdit = ({ fetchMediaImages, images }) => {
  const storage = getStorage(app);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [limit, setLimit] = useState(imgCount);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const onSubmit = data => {
    const file = data.pic[0];
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
            .post('/api/addMediaImage', payload)
            .then(res => {
              setUploading(false);
              fetchMediaImages();
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
      .get(`/api/removeMediaImage/${image._id}`)
      .then(res => {
        const desertRef = ref(storage, image.name);
        deleteObject(desertRef)
          .then(() => {})
          .catch(error => {
            console.log(error);
          });
        fetchMediaImages();
      })
      .catch(err => console.log(err));
  };

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  return (
    <>
      {/* <MediaNav /> */}
      <div
        id='editPictures'
        className='container'
      >
        <h3>Edit Pictures</h3>
        <hr />

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
              <ImageUpload
                name='pic'
                setImage={setImage}
              />
              <div className='d-grid gap-2'>
                <button
                  disabled={uploading || !image}
                  className='submit btn btn-danger mt-3'
                >
                  {uploading
                    ? `Uploading... ${uploadProgress.replace('0', 'O')}%`
                    : 'Add to Images'}
                </button>
              </div>
            </form>
          )}
        />

        {images.length > 0 ? (
          <div className='currentImages'>
            {images.slice(0, limit).map(image => (
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
                  alt='media'
                />
              </div>
            ))}
          </div>
        ) : (
          <h3 className='no-content'>No Images</h3>
        )}

        {limit < images.length && (
          <div className='d-grid see-more'>
            <button
              onClick={seeMoreImages}
              className='btn btn-danger'
            >
              Load More Images
            </button>
          </div>
        )}
      </div>
    </>
  );
};

function mapStateToProps({ media }) {
  return { images: media };
}

export default connect(mapStateToProps, { fetchMediaImages })(PicturesEdit);
