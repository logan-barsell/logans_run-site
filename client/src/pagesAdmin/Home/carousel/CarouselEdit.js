import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../redux/actions';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import {
  uploadHomeImage,
  removeHomeImage,
} from '../../../services/mediaManagementService';
import { useAlert } from '../../../contexts/AlertContext';
import EditImages from '../../../components/Images/EditImages';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const CarouselEdit = ({ fetchHomeImages, images }) => {
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const handleUpload = async (files, setUploadProgress) => {
    // Upload all files with individual progress tracking
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const fileName = new Date().getTime() + '_' + index + '_' + file.name;
      try {
        const downloadURL = await uploadImageToFirebase(file, {
          fileName,
          onProgress: progress => {
            setUploadProgress(prev => ({ ...prev, [index]: progress }));
          },
        });
        return { name: fileName, imgLink: downloadURL, success: true };
      } catch (error) {
        showError(`Failed to upload ${file.name}`);
        return { name: fileName, error: error.message, success: false };
      }
    });
    const uploadResults = await Promise.all(uploadPromises);
    const successfulUploads = uploadResults.filter(result => result.success);
    if (successfulUploads.length > 0) {
      await uploadHomeImage(
        successfulUploads.map(result => ({
          name: result.name,
          imgLink: result.imgLink,
        }))
      );
      showSuccess('Home carousel image(s) uploaded successfully');
      fetchHomeImages();
    }
  };

  const handleRemove = async image => {
    try {
      const imageName = extractStoragePathFromUrl(image.imgLink);
      await removeHomeImage(image._id);
      await deleteImageFromFirebase(imageName);
      showSuccess('Home carousel image removed successfully');
      fetchHomeImages();
    } catch (error) {
      showError('Failed to remove home carousel image');
    }
  };

  return (
    <EditImages
      images={images}
      onUpload={handleUpload}
      onRemove={handleRemove}
      emptyText='No Images'
      uploadButtonText='Add to Images'
      removeConfirmText='Remove from Home Page?'
      containerId='editCarousel'
    />
  );
};

function mapStateToProps({ carouselImages }) {
  return { images: carouselImages?.data || [] };
}

export default connect(mapStateToProps, { fetchHomeImages })(CarouselEdit);
