import './picturesEdit.css';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import axios from 'axios';
import { Form } from 'react-final-form';
import { ImageUpload } from '../../components/Forms/FieldTypes';
import RemoveImage from './RemoveImage';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

const imgCount = 12;
const PicturesEdit = ({ fetchMediaImages, images }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [limit, setLimit] = useState(imgCount);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const onSubmit = async data => {
    const file = data.pic[0];
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
    await axios.post('/api/addMediaImage', payload);
    setUploading(false);
    fetchMediaImages();
  };

  const onFormRestart = form => {
    form.restart();
    const uploadInput = document.querySelector('.upload');
    if (uploadInput) uploadInput.value = null;
  };

  function extractStoragePathFromUrl(url) {
    const match = url && url.match(/\/o\/([^?]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return url ? url.split('/').pop().split('?')[0] : '';
  }

  const removeImage = async image => {
    const imageName = extractStoragePathFromUrl(image.imgLink);
    await axios.get(`/api/removeMediaImage/${image._id}`);
    try {
      await deleteImageFromFirebase(imageName);
    } catch (error) {
      console.log(error);
    }
    fetchMediaImages();
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
