'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHomeImages } from '../../../../../redux/actions';
import {
  uploadImagesBulk,
  deleteImageFromFirebase,
  extractStoragePathFromUrl,
} from '../../../../../lib/firebase';
import {
  uploadHomeImage,
  removeHomeImage,
} from '../../../../../services/homeService';
import { useAlert } from '../../../../../contexts/AlertContext';
import EditImages from '../../../../../components/Images/EditImages';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';

const CarouselEdit = () => {
  const dispatch = useDispatch();
  const images = useSelector(state => state.carouselImages?.data || []);
  const loading = useSelector(state => state.carouselImages?.loading || false);
  const error = useSelector(state => state.carouselImages?.error || null);
  const { showError, showSuccess } = useAlert();
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  useEffect(() => {
    dispatch(fetchHomeImages());
  }, [dispatch]);

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
      dispatch(fetchHomeImages());
    }
  };

  const handleRemove = async image => {
    try {
      const imageName = extractStoragePathFromUrl(image.imgLink);
      await removeHomeImage(image.id);
      await deleteImageFromFirebase(imageName);
      showSuccess('Home carousel image removed successfully');
      dispatch(fetchHomeImages());
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

export default CarouselEdit;
