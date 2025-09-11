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
} from '../../../services/homeService';
import { useAlert } from '../../../contexts/AlertContext';
import EditImages from '../../../components/Images/EditImages';
import LoadingSpinner from '../../../components/LoadingSpinner';
import StaticAlert from '../../../components/Alert/StaticAlert';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const CarouselEdit = ({ fetchHomeImages, images, loading, error }) => {
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
          onProgress: () => {}, // Pass empty function instead of progress tracking
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
      await removeHomeImage(image.id);
      await deleteImageFromFirebase(imageName);
      showSuccess('Home carousel image removed successfully');
      fetchHomeImages();
    } catch (error) {
      showError('Failed to remove home carousel image');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className='text-center py-5'>
        <LoadingSpinner
          size='lg'
          color='white'
          centered={true}
        />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='text-center py-5'>
        <StaticAlert
          type={error.severity || 'danger'}
          title={error.title || 'Error'}
          description={error.message || error}
        />
      </div>
    );
  }

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
  return {
    images: carouselImages?.data || [],
    loading: carouselImages?.loading || false,
    error: carouselImages?.error || null,
  };
}

export default connect(mapStateToProps, { fetchHomeImages })(CarouselEdit);
