import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../redux/actions';
import axios from 'axios';
import { Form } from 'react-final-form';
import { ImageUpload } from '../../../components/Forms/FieldTypes';
import RemoveImage from './RemoveImage';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const CarouselEdit = ({ fetchHomeImages, images }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const onSubmit = async data => {
    const file = data?.pic[0];
    setUploading(true);
    let downloadURL = '';
    let fileName = '';
    try {
      fileName = new Date().getTime() + file.name;
      downloadURL = await uploadImageToFirebase(file, {
        fileName,
        onProgress: setUploadProgress,
      });
    } catch (err) {
      setUploading(false);
      throw err;
    }
    const payload = { name: fileName, imgLink: downloadURL };
    await axios.post('/api/addHomeImage', payload);
    setUploading(false);
    fetchHomeImages();
  };

  const onFormRestart = form => {
    form.restart();
    const uploadInput = document.querySelector('.upload');
    if (uploadInput) uploadInput.value = null;
    setImage(null);
  };

  const removeImage = async image => {
    const imageName = extractStoragePathFromUrl(image.imgLink);
    await axios.get(`/api/removeImage/${image._id}`);
    try {
      await deleteImageFromFirebase(imageName);
    } catch (error) {
      console.log(error);
    }
    fetchHomeImages();
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
              setTimeout(() => {
                onFormRestart(form);
              }, 1000);
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
                  ? `Uploading... ${String(uploadProgress).replaceAll(
                      '0',
                      'O'
                    )}%`
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
