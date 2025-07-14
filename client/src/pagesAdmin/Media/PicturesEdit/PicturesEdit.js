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

const imgCount = 12;
const PicturesEdit = ({ fetchMediaImages, images }) => {
  const { showError, showSuccess } = useAlert();
  const [limit, setLimit] = React.useState(imgCount);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const handleUpload = async (files, setUploadProgress) => {
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
      await removeMediaImage(image._id);
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

  return (
    <>
      <div id='editPictures'>
        <h3>Edit Pictures</h3>
        <hr />
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
