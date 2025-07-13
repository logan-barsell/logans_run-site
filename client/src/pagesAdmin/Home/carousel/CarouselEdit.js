import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../redux/actions';
import { Form } from 'react-final-form';
import { ImageUpload } from '../../../components/Forms/FieldTypes';
import RemoveImage from './RemoveImage';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import {
  uploadHomeImage,
  removeHomeImage,
} from '../../../services/mediaManagementService';
import { useAlert } from '../../../contexts/AlertContext';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const CarouselEdit = ({ fetchHomeImages, images }) => {
  const { showError, showSuccess } = useAlert();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState(null);

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

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
      // Add successful uploads to the database using the single route
      if (successfulUploads.length > 0) {
        await uploadHomeImage(
          successfulUploads.map(result => ({
            name: result.name,
            imgLink: result.imgLink,
          }))
        );
      }

      setUploading(false);
      setUploadProgress({});
      showSuccess('Home carousel image(s) uploaded successfully');
      fetchHomeImages();
    } catch (err) {
      setUploading(false);
      setUploadProgress({});
      console.error('Upload error:', err);
      showError('An error occurred during upload. Please try again.');
    }
  };

  const onFormRestart = form => {
    form.restart();
    const uploadInput = document.querySelector('.upload');
    if (uploadInput) uploadInput.value = null;
    setSelectedFiles(null);
  };

  const removeImage = async image => {
    try {
      const imageName = extractStoragePathFromUrl(image.imgLink);
      await removeHomeImage(image._id);
      try {
        await deleteImageFromFirebase(imageName);
      } catch (error) {
        console.log(error);
      }
      showSuccess('Home carousel image removed successfully');
      fetchHomeImages();
    } catch (error) {
      showError('Failed to remove home carousel image');
    }
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
    )}% )`;
  };

  return (
    <div
      id='editCarousel'
      className='container'
    >
      <h3>Home Page</h3>
      <hr />
      <div className='currentImages container'>
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
    </div>
  );
};

function mapStateToProps({ carouselImages }) {
  return { images: carouselImages?.data || [] };
}

export default connect(mapStateToProps, { fetchHomeImages })(CarouselEdit);
