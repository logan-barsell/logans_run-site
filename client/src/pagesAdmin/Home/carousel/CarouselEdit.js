import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { fetchHomeImages } from '../../../redux/actions';
import {
  uploadImagesBulk,
  deleteImageFromFirebase,
  extractStoragePathFromUrl,
} from '../../../utils/firebase';
import {
  uploadHomeImage,
  removeHomeImage,
} from '../../../services/homeService';
import { useAlert } from '../../../contexts/AlertContext';
import EditImages from '../../../components/Images/EditImages';
import LoadingSpinner from '../../../components/LoadingSpinner';
import StaticAlert from '../../../components/Alert/StaticAlert';

const CarouselEdit = ({ fetchHomeImages, images, loading, error }) => {
  const { showError, showSuccess } = useAlert();
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const handleUpload = async files => {
    const uploadResults = await uploadImagesBulk(files, { tenantId });
    const successfulUploads = uploadResults.filter(result => result.success);
    const failedUploads = uploadResults.filter(result => !result.success);

    // Show consolidated error message for failed uploads
    if (failedUploads.length > 0) {
      showError(
        `Failed to upload ${failedUploads.length} image(s). Please try again.`
      );
    }

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
