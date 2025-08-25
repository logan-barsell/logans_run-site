import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../redux/actions';
import ImageUpload from '../../components/Forms/FieldTypes/ImageUpload';
import { EditableForm } from '../../components/Forms';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';
import { useAlert } from '../../contexts/AlertContext';

const ThemeEdit = ({ theme, fetchTheme, updateTheme }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showError, showSuccess } = useAlert();
  const imageUploadRef = useRef();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const handleSaveTheme = async formData => {
    try {
      setUploading(true);
      let bandLogoUrl = theme.bandLogoUrl;

      if (logoFile) {
        // Delete old image if exists
        if (theme.bandLogoUrl) {
          try {
            await deleteImageFromFirebase(theme.bandLogoUrl);
          } catch (error) {
            // ignore
          }
        }

        try {
          bandLogoUrl = await uploadImageToFirebase(logoFile, {
            onProgress: setUploadProgress,
          });
        } catch (err) {
          setUploading(false);
          showError('Failed to upload logo image');
          throw err;
        }
      }

      // Update theme
      await updateTheme({ ...formData, bandLogoUrl });
      setLogoFile(null);
      setUploading(false);
      // Clear the file input and state
      if (
        imageUploadRef.current &&
        typeof imageUploadRef.current.clear === 'function'
      ) {
        imageUploadRef.current.clear();
      }
    } catch (err) {
      setUploading(false);
      showError(err.message || 'Failed to update theme');
      throw err;
    }
  };

  const handleSuccess = () => {
    showSuccess('Theme updated successfully!');
  };

  const handleError = error => {
    showError(error.message || 'Failed to update theme');
  };

  return (
    <EditableForm
      title='Update Theme'
      containerId='themeEdit'
      initialData={theme}
      onSave={handleSaveTheme}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {({ formData, handleInputChange }) => {
        const handleCheckboxChange = e => {
          const { name, checked } = e.target;
          handleInputChange({
            target: {
              name,
              value: checked,
            },
          });
        };

        return (
          <>
            {/* Basic Information */}
            <div className='mb-4'>
              <div className='mb-sm-3 mb-2 text-white d-flex flex-column align-items-center'>
                <label className='form-label'>Band Logo</label>
                {(logoFile || theme.bandLogoUrl) && (
                  <div style={{ marginBottom: 12 }}>
                    <img
                      src={
                        logoFile
                          ? URL.createObjectURL(logoFile)
                          : theme.bandLogoUrl
                      }
                      alt='Band Logo Preview'
                      style={{
                        maxWidth: 200,
                        maxHeight: 200,
                        display: 'block',
                        borderRadius: 8,
                      }}
                    />
                  </div>
                )}

                <div className='mb-3'>
                  <ImageUpload
                    ref={imageUploadRef}
                    name='bandLogo'
                    setImage={setLogoFile}
                    initialValue={theme.bandLogoUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='siteTitle'
                  className='form-label'
                >
                  Band Name
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='siteTitle'
                  name='siteTitle'
                  value={formData.siteTitle || ''}
                  onChange={handleInputChange}
                  autoComplete='off'
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='catchPhrase'
                  className='form-label'
                >
                  Catch Phrase
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='catchPhrase'
                  name='catchPhrase'
                  value={formData.catchPhrase || ''}
                  onChange={handleInputChange}
                  placeholder='Enter your catch phrase'
                  autoComplete='off'
                />
              </div>
            </div>

            <hr
              className='my-4'
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
            />

            {/* Header & Navigation */}
            <div className='mb-4'>
              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='headerDisplay'
                  className='form-label'
                >
                  Header Display
                </label>
                <select
                  className='form-control'
                  id='headerDisplay'
                  name='headerDisplay'
                  value={formData.headerDisplay || 'band-name-and-logo'}
                  onChange={handleInputChange}
                >
                  <option value='band-name-only'>Band Name Only</option>
                  <option value='band-name-and-logo'>Band Name and Logo</option>
                  <option value='logo-only'>Logo Only</option>
                </select>
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='headerPosition'
                  className='form-label'
                >
                  Header Position
                </label>
                <select
                  className='form-control'
                  id='headerPosition'
                  name='headerPosition'
                  value={formData.headerPosition || 'left'}
                  onChange={handleInputChange}
                >
                  <option value='left'>Left</option>
                  <option value='center'>Center</option>
                  <option value='right'>Right</option>
                </select>
              </div>
            </div>

            <hr
              className='my-4'
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
            />

            {/* Colors */}
            <div className='mb-4'>
              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='primaryColor'
                  className='form-label'
                >
                  Primary Color
                </label>
                <input
                  type='color'
                  className='form-control form-control-color'
                  id='primaryColor'
                  name='primaryColor'
                  value={formData.primaryColor || '#000000'}
                  onChange={handleInputChange}
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='secondaryColor'
                  className='form-label'
                >
                  Secondary Color
                </label>
                <input
                  type='color'
                  className='form-control form-control-color'
                  id='secondaryColor'
                  name='secondaryColor'
                  value={formData.secondaryColor || '#000000'}
                  onChange={handleInputChange}
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='backgroundColor'
                  className='form-label'
                >
                  Background Color
                </label>
                <input
                  type='color'
                  className='form-control form-control-color'
                  id='backgroundColor'
                  name='backgroundColor'
                  value={formData.backgroundColor || '#272727'}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <hr
              className='my-4'
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
            />

            {/* Typography */}
            <div className='mb-4'>
              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='primaryFont'
                  className='form-label'
                >
                  Primary Font
                </label>
                <select
                  className='form-control'
                  id='primaryFont'
                  name='primaryFont'
                  value={formData.primaryFont || ''}
                  onChange={handleInputChange}
                >
                  <optgroup label='Custom Fonts'>
                    <option value='SprayPaint'>SprayPaint (Custom)</option>
                  </optgroup>
                  <optgroup label='Edgy/Rock'>
                    <option value='BebasNeue'>Bebas Neue (Ultra Bold)</option>
                    <option value='Anton'>Anton (Heavy Impact)</option>
                    <option value='Oswald'>
                      Oswald (Condensed Industrial)
                    </option>
                  </optgroup>
                  <optgroup label='60s/70s Hippy'>
                    <option value='Pacifico'>Pacifico (Hippy Vibes)</option>
                  </optgroup>
                  <optgroup label='Metal/Horror'>
                    <option value='Creepster'>Creepster (Horror Metal)</option>
                    <option value='Sancreek'>Sancreek (Western Horror)</option>
                  </optgroup>
                  <optgroup label='Punk/Graffiti'>
                    <option value='VT323'>VT323 (Retro Terminal)</option>
                  </optgroup>
                  <optgroup label='Hand-Drawn/Rock'>
                    <option value='Kalam'>Kalam (Hand-Drawn)</option>
                    <option value='IndieFlower'>Indie Flower (Playful)</option>
                    <option value='ArchitectsDaughter'>
                      Architects Daughter (Sketchy)
                    </option>
                    <option value='ComicNeue'>Comic Neue (Comic Style)</option>
                  </optgroup>
                  <optgroup label='Fun/Bold'>
                    <option value='Righteous'>Righteous (Futuristic)</option>
                    <option value='Lobster'>Lobster (Fun & Bold)</option>
                  </optgroup>
                  <optgroup label='Classic'>
                    <option value='Courier New'>
                      Courier New (Retro/Vintage)
                    </option>
                    <option value='RobotoCondensed'>
                      Roboto Condensed (Clean)
                    </option>
                  </optgroup>
                </select>
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='secondaryFont'
                  className='form-label'
                >
                  Secondary Font
                </label>
                <select
                  className='form-control'
                  id='secondaryFont'
                  name='secondaryFont'
                  value={formData.secondaryFont || ''}
                  onChange={handleInputChange}
                >
                  <optgroup label='Custom Fonts'>
                    <option value='SprayPaint'>SprayPaint (Custom)</option>
                  </optgroup>
                  <optgroup label='Edgy/Rock'>
                    <option value='BebasNeue'>Bebas Neue (Ultra Bold)</option>
                    <option value='Anton'>Anton (Heavy Impact)</option>
                    <option value='Oswald'>
                      Oswald (Condensed Industrial)
                    </option>
                  </optgroup>
                  <optgroup label='60s/70s Hippy'>
                    <option value='Pacifico'>Pacifico (Hippy Vibes)</option>
                  </optgroup>
                  <optgroup label='Metal/Horror'>
                    <option value='Creepster'>Creepster (Horror Metal)</option>
                    <option value='Sancreek'>Sancreek (Western Horror)</option>
                  </optgroup>
                  <optgroup label='Punk/Graffiti'>
                    <option value='VT323'>VT323 (Retro Terminal)</option>
                  </optgroup>
                  <optgroup label='Hand-Drawn/Rock'>
                    <option value='Kalam'>Kalam (Hand-Drawn)</option>
                    <option value='IndieFlower'>Indie Flower (Playful)</option>
                    <option value='ArchitectsDaughter'>
                      Architects Daughter (Sketchy)
                    </option>
                    <option value='ComicNeue'>Comic Neue (Comic Style)</option>
                  </optgroup>
                  <optgroup label='Fun/Bold'>
                    <option value='Righteous'>Righteous (Futuristic)</option>
                    <option value='Lobster'>Lobster (Fun & Bold)</option>
                  </optgroup>
                  <optgroup label='Classic'>
                    <option value='Courier New'>
                      Courier New (Retro/Vintage)
                    </option>
                    <option value='RobotoCondensed'>
                      Roboto Condensed (Clean)
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>

            <hr
              className='my-4'
              style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
            />

            {/* Social Media & Features */}
            <div className='mb-4'>
              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='socialMediaIconStyle'
                  className='form-label'
                >
                  Social Media Icon Style
                </label>
                <select
                  className='form-control'
                  id='socialMediaIconStyle'
                  name='socialMediaIconStyle'
                  value={formData.socialMediaIconStyle || 'default'}
                  onChange={handleInputChange}
                >
                  <option value='default'>Default</option>
                  <option value='minimal'>Minimal</option>
                  <option value='colorful'>Colorful</option>
                  <option value='outlined'>Outlined</option>
                  <option value='filled'>Filled</option>
                </select>
              </div>

              <div className='mb-sm-3 mb-2'>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    id='newsletterEnabled'
                    name='newsletterEnabled'
                    checked={formData.newsletterEnabled !== false}
                    onChange={handleCheckboxChange}
                    style={{
                      backgroundColor:
                        formData.newsletterEnabled !== false
                          ? 'var(--main)'
                          : 'transparent',
                      borderColor: 'var(--main)',
                      color: 'white',
                    }}
                  />
                  <label
                    className='form-check-label secondary-font'
                    htmlFor='newsletterEnabled'
                    style={{ color: 'white' }}
                  >
                    Enable Newsletter Signup
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </EditableForm>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || {},
});

export default connect(mapStateToProps, { fetchTheme, updateTheme })(ThemeEdit);
