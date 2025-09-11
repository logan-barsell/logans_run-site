import './picturesEdit.css';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../../redux/actions';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import {
  uploadMediaImage,
  removeMediaImage,
} from '../../../services/mediaService';
import { useAlert } from '../../../contexts/AlertContext';
import EditImages from '../../../components/Images/EditImages';
import Button from '../../../components/Button/Button';
import { PageTitle } from '../../../components/Header';
import LoadingSpinner from '../../../components/LoadingSpinner';
import StaticAlert from '../../../components/Alert/StaticAlert';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const imgCount = 12;
const PicturesEdit = ({ fetchMediaImages, images, loading, error }) => {
  const { showError, showSuccess } = useAlert();
  const [limit, setLimit] = React.useState(imgCount);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const handleUpload = async files => {
    const uploadPromises = Array.from(files).map(async (file, index) => {
      const fileName = new Date().getTime() + '_' + index + '_' + file.name;
      try {
        const downloadURL = await uploadImageToFirebase(file, {
          fileName,
          onProgress: () => {},
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
      await uploadMediaImage(
        successfulUploads.map(result => ({
          name: result.name,
          imgLink: result.imgLink,
        }))
      );
      showSuccess(
        `Successfully uploaded ${successfulUploads.length} image(s)!`
      );
      fetchMediaImages();
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
      fetchMediaImages();
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

function mapStateToProps({ media }) {
  return {
    images: media?.data || [],
    loading: media?.loading || false,
    error: media?.error || null,
  };
}

export default connect(mapStateToProps, { fetchMediaImages })(PicturesEdit);
