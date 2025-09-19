'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBio } from '../../../../redux/actions';
import { updateBio } from '../../../../services/bioService';
import SecondaryNav from '../../../../components/Navbar/SecondaryNav/SecondaryNav';
import CurrentMembers from './CurrentMembers';
import { useAlert } from '../../../../contexts/AlertContext';
import { EditableForm } from '../../../../components/Forms';
import ResponsiveImageDisplay from '../../../../components/Forms/ResponsiveImageDisplay';
import { BIO_FIELDS } from './constants';
import { uploadImageAndReplace } from '../../../../lib/firebase';

export default function BioEditPage() {
  const dispatch = useDispatch();
  const bio = useSelector(state => state.currentBio?.data || []);
  const theme = useSelector(state => state.theme?.data || null);
  const { user } = useSelector(state => state.auth);
  const { showError, showSuccess } = useAlert();
  const [uploading, setUploading] = useState(false);
  const tenantId = user?.tenantId;
  const imageUploadRef = useRef();

  useEffect(() => {
    dispatch(fetchBio());
  }, [dispatch]);

  // Normalize bio state to single object (supports legacy array or object)
  const bioRow = Array.isArray(bio) ? bio[0] || {} : bio || {};

  const handleSubmit = async values => {
    setUploading(true);
    let customImageUrl = values.customImage;

    try {
      // Validate that custom image is provided when custom image type is selected
      if (values.imageType === 'CUSTOM_IMAGE' && !values.customImage) {
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
              bioRow?.customImageUrl,
              { tenantId }
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
    dispatch(fetchBio());
  };

  // Define the form fields configuration
  const headerHasLogo = Boolean(theme?.bandHeaderLogoUrl);
  const bioFields = BIO_FIELDS.map(field => {
    if (field.name === 'imageType') {
      return {
        ...field,
        options: (field.options || []).filter(
          opt => opt.value !== 'HEADER_LOGO' || headerHasLogo
        ),
      };
    }
    return field;
  });

  // Get current bio data for initial values
  const initialImageTypeCandidate = bioRow.imageType || 'BAND_LOGO';
  const initialValues = {
    text: bioRow.text || '',
    imageType:
      initialImageTypeCandidate === 'HEADER_LOGO' && !headerHasLogo
        ? 'BAND_LOGO'
        : initialImageTypeCandidate,
    customImage: bioRow.customImageUrl || '',
  };
  console.log('bioRow ET:', bioRow);

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
        imageRef={imageUploadRef}
        onSuccess={handleSuccess}
      >
        {({ values }) => {
          const currentImageType = values.imageType || 'BAND_LOGO';
          const maxHeight = currentImageType === 'HEADER_LOGO' ? 125 : 200;
          return (
            <>
              {/* Image Display */}
              <div className='mb-4'>
                {bioRow.imageType ? (
                  <>
                    {currentImageType === 'BAND_LOGO' && theme?.bandLogoUrl && (
                      <ResponsiveImageDisplay
                        src={theme.bandLogoUrl}
                        alt='Icon Logo'
                        maxHeight={maxHeight}
                      />
                    )}

                    {currentImageType === 'HEADER_LOGO' &&
                      theme?.bandHeaderLogoUrl && (
                        <ResponsiveImageDisplay
                          src={theme.bandHeaderLogoUrl}
                          alt='Header Logo'
                          maxHeight={maxHeight}
                        />
                      )}

                    {currentImageType === 'CUSTOM_IMAGE' &&
                      initialValues.customImage && (
                        <ResponsiveImageDisplay
                          src={initialValues.customImage}
                          alt='Custom bio display'
                          maxHeight={maxHeight}
                          className='rounded'
                        />
                      )}
                  </>
                ) : null}
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
}
