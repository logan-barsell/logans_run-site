import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchBio } from '../../redux/actions';
import { updateBio } from '../../services/bioService';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentMembers from './CurrentMembers';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';
import { BIO_FIELDS } from './constants';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

const BioEdit = ({ fetchBio, bio, theme }) => {
  const { showError, showSuccess } = useAlert();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBio();
  }, [fetchBio]);

  const handleSubmit = async values => {
    setUploading(true);
    let customImageUrl = values.customImage;

    try {
      // Validate that custom image is provided when custom image type is selected
      if (values.imageType === 'custom-image' && !values.customImage) {
        throw new Error(
          'Please upload a custom image when selecting custom image type'
        );
      }

      // Handle custom image upload if there's a new file
      if (values.customImage && values.customImage instanceof File) {
        // Delete old custom image if it exists
        if (bio && bio.length > 0 && bio[0].customImageUrl) {
          try {
            await deleteImageFromFirebase(bio[0].customImageUrl);
          } catch (error) {
            // ignore
          }
        }

        try {
          customImageUrl = await uploadImageToFirebase(values.customImage, {
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
        text: values.text,
        imageType: values.imageType,
        customImageUrl: customImageUrl,
      };

      await updateBio(dataToSave);
      setUploading(false);
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

  // Define the form fields configuration
  const bioFields = BIO_FIELDS;

  // Get current bio data for initial values
  const bioData = bio && bio.length > 0 ? bio[0] : {};
  const initialValues = {
    text: bioData.text || '',
    imageType: bioData.imageType || 'band-logo',
    customImage: bioData.customImageUrl || '',
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Update Bio'
        containerId='bioEdit'
        className='bio-form'
        fields={bioFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        successMessage='Update Successful'
        loading={uploading}
        onSuccess={handleSuccess}
      >
        {({ values }) => {
          const currentImageType = values.imageType || 'band-logo';

          return (
            <>
              {/* Image Display */}
              <div className='mb-4'>
                {currentImageType === 'band-logo' && theme?.bandLogoUrl && (
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

                {currentImageType === 'custom-image' &&
                  initialValues.customImage && (
                    <div className='text-center mb-3'>
                      <img
                        src={initialValues.customImage}
                        alt='Custom bio display'
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
