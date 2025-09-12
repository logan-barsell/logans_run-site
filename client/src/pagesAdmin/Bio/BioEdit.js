import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchBio } from '../../redux/actions';
import { updateBio } from '../../services/bioService';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentMembers from './CurrentMembers';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';
import ResponsiveImageDisplay from '../../components/Forms/ResponsiveImageDisplay';
import { BIO_FIELDS } from './constants';
import { uploadImageAndReplace } from '../../utils/firebase';

const BioEdit = ({ fetchBio, bio, theme }) => {
  const { showError, showSuccess } = useAlert();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBio();
  }, [fetchBio]);

  // Normalize bio state to single object (supports legacy array or object)
  const bioRow = Array.isArray(bio) ? bio[0] || {} : bio || {};

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

      // Handle custom image upload if there's a new file or FileList
      if (values.customImage) {
        const file =
          values.customImage instanceof FileList
            ? values.customImage[0]
            : values.customImage;

        if (file instanceof File) {
          try {
            customImageUrl = await uploadImageAndReplace(
              file,
              bioRow?.customImageUrl
            );
          } catch (err) {
            setUploading(false);
            showError('Failed to upload custom image');
            throw err;
          }
        }
      }

      // Update bio with image settings (do not send raw customImage)
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
  const headerHasLogo = Boolean(theme?.bandHeaderLogoUrl);
  const bioFields = BIO_FIELDS.map(field => {
    if (field.name === 'imageType') {
      return {
        ...field,
        options: (field.options || []).filter(
          opt => opt.value !== 'header-logo' || headerHasLogo
        ),
      };
    }
    return field;
  });

  // Get current bio data for initial values
  const initialImageTypeCandidate = bioRow.imageType || 'band-logo';
  const initialValues = {
    text: bioRow.text || '',
    imageType:
      initialImageTypeCandidate === 'header-logo' && !headerHasLogo
        ? 'band-logo'
        : initialImageTypeCandidate,
    customImage: bioRow.customImageUrl || '',
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Edit Bio'
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
                  <ResponsiveImageDisplay
                    src={theme.bandLogoUrl}
                    alt='Icon Logo'
                    maxHeight='200px'
                  />
                )}

                {currentImageType === 'header-logo' &&
                  theme?.bandHeaderLogoUrl && (
                    <ResponsiveImageDisplay
                      src={theme.bandHeaderLogoUrl}
                      alt='Header Logo'
                      maxHeight='200px'
                    />
                  )}

                {currentImageType === 'custom-image' &&
                  initialValues.customImage && (
                    <ResponsiveImageDisplay
                      src={initialValues.customImage}
                      alt='Custom bio display'
                      maxHeight='200px'
                    />
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
