import './picturesEdit.css';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import { Form } from 'react-final-form';
import { ImageUploadField } from '../../components/Forms/FieldTypes/ImageUpload';
import RemoveImage from './RemoveImage';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';
import {
  uploadMediaImage,
  removeMediaImage,
} from '../../services/mediaManagementService';
import { useAlert } from '../../contexts/AlertContext';

const imgCount = 12;
const PicturesEdit = ({ fetchMediaImages, images }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [limit, setLimit] = useState(imgCount);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const onSubmit = async data => {
    const files = data.pic;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      // Upload all files with individual progress tracking
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const fileName = new Date().getTime() + '_' + index + '_' + file.name;

        try {
          const downloadURL = await uploadImageToFirebase(file, {
            fileName,
            onProgress: progress => {
              setUploadProgress(prev => ({
                ...prev,
                [index]: progress,
              }));
            },
          });

          return { name: fileName, imgLink: downloadURL, success: true };
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          return { name: fileName, error: error.message, success: false };
        }
      });

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Separate successful and failed uploads
      const successfulUploads = uploadResults.filter(result => result.success);
      const failedUploads = uploadResults.filter(result => !result.success);

      // Add successful uploads to the database using the single route
      if (successfulUploads.length > 0) {
        await uploadMediaImage(
          successfulUploads.map(result => ({
            name: result.name,
            imgLink: result.imgLink,
          }))
        );
      }

      setUploading(false);
      setUploadProgress({});
      fetchMediaImages();
      showSuccess(
        `Successfully uploaded ${successfulUploads.length} image(s)!`
      );
    } catch (err) {
      setUploading(false);
      setUploadProgress({});
      console.error('Upload error:', err);
      showError(
        err.message || 'An error occurred during upload. Please try again.'
      );
    }
  };

  const onFormRestart = form => {
    form.restart();
    const uploadInput = document.querySelector('.upload');
    if (uploadInput) uploadInput.value = null;
    setSelectedFiles(null);
  };

  function extractStoragePathFromUrl(url) {
    const match = url && url.match(/\/o\/([^?]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return url ? url.split('/').pop().split('?')[0] : '';
  }

  const removeImage = async image => {
    try {
      const imageName = extractStoragePathFromUrl(image.imgLink);
      await removeMediaImage(image._id);
      try {
        await deleteImageFromFirebase(imageName);
      } catch (error) {
        console.log(error);
      }
      fetchMediaImages();
      showSuccess('Image removed successfully!');
    } catch (err) {
      showError(err.message || 'Failed to remove image');
    }
  };

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  const getUploadButtonText = () => {
    if (!uploading) return 'Add to Images';

    const totalFiles = selectedFiles ? selectedFiles.length : 0;
    if (totalFiles === 0) return 'Uploading...';

    const totalProgress = Object.values(uploadProgress).reduce(
      (sum, progress) => sum + progress,
      0
    );
    const averageProgress = totalProgress / totalFiles;

    return `Uploading... ${String(Math.round(averageProgress)).replace(
      '0',
      'O'
    )}%`;
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
              <ImageUploadField
                name='pic'
                setImage={setSelectedFiles}
                multiple={true}
              />

              <div className='d-grid gap-2'>
                <button
                  disabled={
                    uploading || !selectedFiles || selectedFiles.length === 0
                  }
                  className='submit btn btn-danger mt-3'
                >
                  {getUploadButtonText()}
                </button>
              </div>
            </form>
          )}
        />

        {images && images.length > 0 ? (
          <div className='currentImages'>
            {(images || []).slice(0, limit).map(image => (
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

        {limit < (images?.length || 0) && (
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
  return { images: media?.data || [] };
}

export default connect(mapStateToProps, { fetchMediaImages })(PicturesEdit);
