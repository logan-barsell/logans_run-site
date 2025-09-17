'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTheme } from '../../../../../redux/actions';
import { updateTheme as updateThemeService } from '../../../../../services/themeService';
import { EditableForm } from '../../../../../components/Forms';
import ResponsiveImageDisplay from '../../../../../components/Forms/ResponsiveImageDisplay';
import SelectField from '../../../../../components/Forms/FieldTypes/SelectField';
import { useAlert } from '../../../../../contexts/AlertContext';
import { useTheme } from '../../../../../contexts/ThemeContext';
import { uploadImageAndReplace } from '../../../../../lib/firebase';
import { THEME_FIELDS } from './constants';

const ThemeEdit = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme?.data || {});
  const user = useSelector(state => state.auth?.user);
  const [uploading, setUploading] = useState(false);
  const [logoType, setLogoType] = useState('header'); // 'icon' | 'header'
  const { showError, showSuccess } = useAlert();
  const { updateTheme: updateThemeContext } = useTheme();
  const imageUploadRef = useRef();
  const tenantId = user?.tenantId;

  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  const handleSubmit = async values => {
    setUploading(true);
    let bandLogoUrl = values.bandLogo;
    let bandHeaderLogoUrl = values.bandHeaderLogo;

    try {
      // Handle band logo upload if there's a new file or FileList
      if (values.bandLogo) {
        const file =
          values.bandLogo instanceof FileList
            ? values.bandLogo[0]
            : values.bandLogo;

        if (file instanceof File) {
          try {
            bandLogoUrl = await uploadImageAndReplace(
              file,
              theme?.bandLogoUrl,
              {
                tenantId,
              }
            );
          } catch (err) {
            showError('Failed to upload band logo');
            throw err;
          }
        }
      }

      // Handle header logo upload if there's a new file or FileList
      if (values.bandHeaderLogo) {
        const file =
          values.bandHeaderLogo instanceof FileList
            ? values.bandHeaderLogo[0]
            : values.bandHeaderLogo;

        if (file instanceof File) {
          try {
            bandHeaderLogoUrl = await uploadImageAndReplace(
              file,
              theme?.bandHeaderLogoUrl,
              { tenantId }
            );
          } catch (err) {
            showError('Failed to upload header logo');
            throw err;
          }
        }
      }

      // Update theme with logo settings
      const { bandLogo, bandHeaderLogo, __logoType, ...rest } = values;
      const dataToSave = {
        ...rest,
        bandLogoUrl,
        bandHeaderLogoUrl,
      };

      await updateThemeService(dataToSave);
      showSuccess('Theme updated successfully');

      // Update theme context immediately for instant visual feedback
      updateThemeContext(dataToSave);

      // Refresh Redux theme so UI reflects latest
      dispatch(fetchTheme());
    } catch (err) {
      showError(err.message || 'Failed to update theme');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Use fields from constants, but hide logo options when no logos exist yet
  const headerHasLogo = Boolean(theme?.bandHeaderLogoUrl);
  const bandHasLogo = Boolean(theme?.bandLogoUrl);

  // First adjust header display options
  const baseFields = THEME_FIELDS.map(field => {
    if (field.name === 'headerDisplay') {
      return {
        ...field,
        options: (field.options || []).filter(opt => {
          // Hide header-logo-only if no header logo
          if (opt.value === 'header-logo-only' && !headerHasLogo) {
            return false;
          }
          // Hide logo-only if no band logo
          if (opt.value === 'logo-only' && !bandHasLogo) {
            return false;
          }
          // Hide band-name-and-logo if no band logo
          if (opt.value === 'band-name-and-logo' && !bandHasLogo) {
            return false;
          }
          return true;
        }),
      };
    }
    return field;
  });
  // Then filter which image field is visible based on local logoType
  const themeFields = baseFields.filter(field => {
    if (logoType === 'icon') {
      return field.name !== 'bandHeaderLogo';
    }
    if (logoType === 'header') {
      return field.name !== 'bandLogo';
    }
    return true;
  });

  // Get current theme data for initial values
  const initialValues = {
    bandLogo: theme?.bandLogoUrl || '',
    bandHeaderLogo: theme?.bandHeaderLogoUrl || '',
    siteTitle: theme?.siteTitle || '',
    greeting: theme?.greeting || '',
    introduction: theme?.introduction || '',
    headerDisplay: theme?.headerDisplay || 'band-name-and-logo',
    headerPosition: theme?.headerPosition || 'left',
    backgroundColor: theme?.backgroundColor || 'black',
    primaryColor: theme?.primaryColor || '#000000',
    secondaryColor: theme?.secondaryColor || '#ffffff',
    primaryFont: theme?.primaryFont || 'MetalMania',
    secondaryFont: theme?.secondaryFont || 'CourierPrime',
    socialMediaIconStyle: theme?.socialMediaIconStyle || 'default',
    paceTheme: theme?.paceTheme || 'minimal',
    __logoType: 'icon',
  };

  // If logos aren't available but the saved value requires them, fall back to band-name-only
  if (!headerHasLogo && initialValues.headerDisplay === 'header-logo-only') {
    initialValues.headerDisplay = 'band-name-only';
  }
  if (
    !bandHasLogo &&
    (initialValues.headerDisplay === 'logo-only' ||
      initialValues.headerDisplay === 'band-name-and-logo')
  ) {
    initialValues.headerDisplay = 'band-name-only';
  }

  const maxHeight = logoType === 'header' ? 100 : 150;
  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Edit Theme'
        fields={themeFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText='Save Theme'
        successMessage='Update Successful'
        loading={uploading}
        imageRef={imageUploadRef}
        ignoreDirtyFields={['__logoType']}
      >
        {() => {
          return (
            <>
              {/* Logo type selector using existing SelectField */}
              <SelectField
                label='Manage Logos'
                name='__logoType'
                options={[
                  { value: 'header', label: 'Header Logo' },
                  { value: 'icon', label: 'Icon Logo' },
                ]}
                initialValue={logoType}
                onChange={e => setLogoType(e.target.value)}
                placeholder='Select Logo Type'
                selectProps={{ value: logoType }}
                className='mb-4'
                helperText={
                  logoType === 'header'
                    ? 'Upload a wide logo (e.g., 800×200) used as a header logo'
                    : 'Upload a square icon (e.g., 512×512) used for favicon and icon logo'
                }
              />

              {/* Logo Display */}
              <div className='mb-4'>
                <ResponsiveImageDisplay
                  src={
                    logoType === 'header'
                      ? initialValues.bandHeaderLogo
                      : initialValues.bandLogo
                  }
                  alt={logoType === 'header' ? 'Header Logo' : 'Icon Logo'}
                  maxHeight={maxHeight}
                />
              </div>
            </>
          );
        }}
      </EditableForm>
    </div>
  );
};

export default ThemeEdit;
