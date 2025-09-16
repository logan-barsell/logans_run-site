'use client';

import './picturesEdit.css';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMediaImages } from '../../../../../redux/actions';
import {
  uploadImagesBulk,
  deleteImageFromFirebase,
  extractStoragePathFromUrl,
} from '../../../../../lib/firebase';
import {
  uploadMediaImage,
  removeMediaImage,
} from '../../../../../services/mediaService';
import { useAlert } from '../../../../../contexts/AlertContext';
import EditImages from '../../../../../components/Images/EditImages';
import Button from '../../../../../components/Button/Button.jsx';
import { PageTitle } from '../../../../../components/Header';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';

const imgCount = 12;
const PicturesEdit = () => {
  const dispatch = useDispatch();
  const images = useSelector(state => state.media?.data || []);
  const loading = useSelector(state => state.media?.loading || false);
  const error = useSelector(state => state.media?.error || null);
  const { showError, showSuccess } = useAlert();
  const [limit, setLimit] = React.useState(imgCount);
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  useEffect(() => {
    dispatch(fetchMediaImages());
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
      await uploadMediaImage(
        successfulUploads.map(result => ({
          name: result.name,
          imgLink: result.imgLink,
        }))
      );
      showSuccess(
        `Successfully uploaded ${successfulUploads.length} image(s)!`
      );
      dispatch(fetchMediaImages());
    }
  };

  const handleRemove = async image => {
    try {
      const imageName = extractStoragePathFromUrl(image.imgLink);
      await removeMediaImage(image.id);
      try {
        await deleteImageFromFirebase(imageName);
      } catch (error) {
        // ignore firebase error
      }
      dispatch(fetchMediaImages());
      showSuccess('Image removed successfully!');
    } catch (err) {
      showError(err.message || 'Failed to remove image');
    }
  };

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  // Show loading state
  if (loading) {
    return (
      <div id='editPictures'>
        <PageTitle divider>Edit Pictures</PageTitle>
        <div className='text-center py-5'>
          <LoadingSpinner
            size='lg'
            color='white'
            centered={true}
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div id='editPictures'>
        <PageTitle divider>Edit Pictures</PageTitle>
        <div className='text-center py-5'>
          <StaticAlert
            type={error.severity || 'danger'}
            title={error.title || 'Error'}
            description={error.message || error}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div id='editPictures'>
        <PageTitle divider>Edit Pictures</PageTitle>
        <EditImages
          images={(images || []).slice(0, limit)}
          onUpload={handleUpload}
          onRemove={handleRemove}
          emptyText='No Images'
          uploadButtonText='Add to Images'
          removeConfirmText='Remove from Media Page?'
          containerId='editPictures'
          imagesPosition='bottom'
        />
        {limit < (images?.length || 0) && (
          <div className='d-grid see-more'>
            <Button
              onClick={seeMoreImages}
              variant='danger'
            >
              Load More Images
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default PicturesEdit;
