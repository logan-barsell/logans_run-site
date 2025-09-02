import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { fetchBio } from '../../redux/actions';
import { updateBio } from '../../services/bioService';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentMembers from './CurrentMembers';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';
import ImageUpload from '../../components/Forms/FieldTypes/ImageUpload';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

const BioEdit = ({ fetchBio, bio, theme }) => {
  const { showError, showSuccess } = useAlert();
  const [customImageFile, setCustomImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageUploadRef = useRef();

  useEffect(() => {
    fetchBio();
  }, [fetchBio]);

  const handleSave = async data => {
    setUploading(true);
    let customImageUrl = data.customImageUrl;

    try {
      // Validate that custom image is provided when custom image type is selected
      if (
        data.imageType === 'custom-image' &&
        !customImageFile &&
        !customImageUrl
      ) {
        throw new Error(
          'Please upload a custom image when selecting custom image type'
        );
      }

      // Handle custom image upload if there's a new file
      if (customImageFile) {
        // Delete old custom image if it exists
        if (bio && bio.length > 0 && bio[0].customImageUrl) {
          try {
            await deleteImageFromFirebase(bio[0].customImageUrl);
          } catch (error) {
            // ignore
          }
        }

        try {
          customImageUrl = await uploadImageToFirebase(customImageFile, {
            onProgress: () => {}, // Pass empty function instead of setUploadProgress
          });
        } catch (err) {
          setUploading(false);
          showError('Failed to upload custom image');
          throw err;
        }
      }

      // Update bio with image settings
      const dataToSave = {
        text: data.text || (bio && bio.length > 0 ? bio[0].text : ''),
        imageType: data.imageType,
        customImageUrl: customImageUrl,
      };

      await updateBio(dataToSave);
      setCustomImageFile(null);
      setUploading(false);

      // Clear the file input and state
      if (
        imageUploadRef.current &&
        typeof imageUploadRef.current.clear === 'function'
      ) {
        imageUploadRef.current.clear();
      }
    } catch (err) {
      console.error('Save bio error:', err);
      setUploading(false);
      showError(err.message || 'Failed to update bio information');
      throw err;
    }
  };

  const handleSuccess = () => {
    showSuccess('Bio updated successfully');
    fetchBio();
  };

  const handleError = error => {
    // Only show error if it's not already handled in handleSave
    if (error && !error.message.includes('Failed to update bio information')) {
      showError(error.message || 'Failed to update bio information');
    }
  };

  // Custom comparison function for bio text and image settings
  const compareFunction = (initial, current) => {
    if (!initial || !current) return false;
    const initialText = initial.text || '';
    const currentText = current.text || '';
    const initialImageType = initial.imageType || 'band-logo';
    const currentImageType = current.imageType || 'band-logo';
    const initialCustomImageUrl = initial.customImageUrl || '';
    const currentCustomImageUrl = current.customImageUrl || '';

    // Check if there are actual changes to the form data OR if a new file is uploaded
    const hasFormChanges = !(
      initialText === currentText &&
      initialImageType === currentImageType &&
      initialCustomImageUrl === currentCustomImageUrl
    );

    // Check if a new file is uploaded
    const hasFileChanges = customImageFile !== null;

    const hasChanges = hasFormChanges || hasFileChanges;

    // If there are no changes, return true (no changes)
    if (!hasChanges) {
      return true;
    }

    // If there are changes, check if the form is valid
    // Form is invalid only if custom image type is selected but no image is provided
    const isFormValid = !(
      currentImageType === 'custom-image' &&
      !customImageFile &&
      !currentCustomImageUrl
    );

    // Return false if form is valid (allow changes), true if invalid (prevent submission)
    return !isFormValid;
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Update Bio'
        containerId='bioEdit'
        className='bio-form'
        initialData={bio && bio.length > 0 ? bio[0] : null}
        onSave={handleSave}
        onSuccess={handleSuccess}
        onError={handleError}
        compareFunction={compareFunction}
        loading={uploading}
      >
        {({ formData, handleInputChange }) => {
          const currentImageType = formData.imageType || 'band-logo';
          const showBandLogo = currentImageType === 'band-logo';
          const showCustomImage = currentImageType === 'custom-image';

          return (
            <>
              {/* Image Display */}
              <div className='mb-4'>
                {showBandLogo && theme?.bandLogoUrl && (
                  <div className='text-center mb-3'>
                    <img
                      src={theme.bandLogoUrl}
                      alt='Band Logo'
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        display: 'block',
                        margin: '0 auto',
                      }}
                    />
                  </div>
                )}

                {showCustomImage && (
                  <div className='text-center mb-3'>
                    {(customImageFile ||
                      (bio && bio.length > 0 && bio[0].customImageUrl)) && (
                      <div style={{ marginBottom: 12 }}>
                        <img
                          src={
                            customImageFile
                              ? URL.createObjectURL(customImageFile)
                              : bio[0].customImageUrl
                          }
                          alt='Custom Bio Preview'
                          style={{
                            maxWidth: '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            margin: '0 auto',
                          }}
                        />
                      </div>
                    )}
                    <div className='mb-3 d-flex justify-content-center'>
                      <ImageUpload
                        ref={imageUploadRef}
                        name='customImage'
                        setImage={setCustomImageFile}
                        initialValue={
                          bio && bio.length > 0 ? bio[0].customImageUrl : null
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Type Selection */}
              <div className='mb-4'>
                <select
                  name='imageType'
                  value={currentImageType}
                  onChange={handleInputChange}
                  className='form-select'
                  id='imageType'
                  style={{
                    backgroundColor: 'var(--form-bg)',
                    color: 'white',
                    border: '2px solid rgba(425, 425, 425, 0.1)',
                  }}
                >
                  <option value='band-logo'>Band Logo</option>
                  <option value='custom-image'>Custom Image</option>
                </select>
                <div className='form-text'>
                  Choose whether to display the band logo or a custom image
                  above the bio text.
                </div>
              </div>

              {/* Bio Text */}
              <div className='mb-3'>
                <textarea
                  name='text'
                  defaultValue={formData.text || ''}
                  onChange={handleInputChange}
                  required
                  className='form-control'
                  id='bioText'
                  rows={6}
                />
              </div>
            </>
          );
        }}
      </EditableForm>
      <SecondaryNav label={'Members'} />
      <div className='container'>
        <div className='row'>
          <CurrentMembers />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ currentBio, members, theme }) {
  return {
    bio: currentBio?.data || [],
    members: members?.data || [],
    theme: theme?.data || null,
  };
}

export default connect(mapStateToProps, { fetchBio })(BioEdit);
