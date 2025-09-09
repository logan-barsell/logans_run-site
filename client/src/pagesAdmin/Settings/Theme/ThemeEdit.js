import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../../redux/actions';
import { EditableForm } from '../../../components/Forms';
import { useAlert } from '../../../contexts/AlertContext';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../../utils/firebaseImage';
import { THEME_FIELDS } from './constants';

const ThemeEdit = ({ theme, fetchTheme, updateTheme }) => {
  const [uploading, setUploading] = useState(false);
  const { showError, showSuccess } = useAlert();
  const imageUploadRef = useRef();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const handleSubmit = async values => {
    setUploading(true);
    let bandLogoUrl = values.bandLogo;

    try {
      // Handle band logo upload if there's a new file
      if (values.bandLogo && values.bandLogo instanceof File) {
        // Delete old band logo if it exists
        if (theme && theme.bandLogoUrl) {
          try {
            await deleteImageFromFirebase(theme.bandLogoUrl);
          } catch (error) {
            // ignore
          }
        }

        try {
          bandLogoUrl = await uploadImageToFirebase(values.bandLogo, {
            onProgress: () => {}, // Pass empty function instead of setUploadProgress
          });
        } catch (err) {
          setUploading(false);
          showError('Failed to upload band logo');
          return;
        }
      }

      // Update theme with logo settings
      const dataToSave = {
        ...values,
        bandLogoUrl: bandLogoUrl,
      };

      await updateTheme(dataToSave);
      setUploading(false);
      showSuccess('Theme updated successfully');
    } catch (err) {
      setUploading(false);
      showError(err.message || 'Failed to update theme');
    }
  };

  // Use fields from constants
  const themeFields = THEME_FIELDS;

  // Get current theme data for initial values
  const initialValues = {
    bandLogo: theme?.bandLogoUrl || '',
    headerDisplay: theme?.headerDisplay || 'band-name-and-logo',
    headerPosition: theme?.headerPosition || 'left',
    backgroundColor: theme?.backgroundColor || 'black',
    primaryColor: theme?.primaryColor || '#000000',
    secondaryColor: theme?.secondaryColor || '#ffffff',
    primaryFont: theme?.primaryFont || 'MetalMania',
    secondaryFont: theme?.secondaryFont || 'CourierPrime',
    socialMediaIconStyle: theme?.socialMediaIconStyle || 'default',
    paceTheme: theme?.paceTheme || 'minimal',
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        fields={themeFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText='Save Theme'
        successMessage='Update Successful'
        loading={uploading}
        imageRef={imageUploadRef}
      >
        {({ values }) => {
          const currentHeaderDisplay =
            values?.headerDisplay || initialValues.headerDisplay;

          return (
            <>
              {/* Logo Display */}
              <div className='mb-4'>
                {currentHeaderDisplay !== 'band-name-only' &&
                  initialValues.bandLogo && (
                    <div className='text-center mb-3'>
                      <img
                        src={initialValues.bandLogo}
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
              </div>
            </>
          );
        }}
      </EditableForm>
    </div>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || {},
});

export default connect(mapStateToProps, { fetchTheme, updateTheme })(ThemeEdit);
