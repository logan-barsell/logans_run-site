import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../redux/actions';
import EditableForm from '../../components/Forms/EditableForm';
import ImageUpload from '../../components/Forms/FieldTypes/ImageUpload';
import { useAlert } from '../../contexts/AlertContext';
import {
  Facebook,
  Instagram,
  YouTube,
  Spotify,
  AppleMusic,
  SoundCloud,
  X,
  TikTok,
} from '../../components/icons';
import {
  getColorPalette,
  getPreselectedColors,
  getColorName,
} from '../../utils/colorPalettes';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

// Theme display names mapping
const themeDisplayNames = {
  black: 'Black',
  purple: 'Purple',
  red: 'Red',
  green: 'Green',
  teal: 'Teal',
  blue: 'Blue',
  burgundy: 'Burgundy',
  gray: 'Gray',
  brown: 'Brown',
  pink: 'Pink',
};

// Social Media Icon Preview Component
const SocialMediaIconPreview = ({ style = 'default' }) => {
  return (
    <div className='d-flex align-items-center  gap-2 mt-2'>
      <span
        className='secondary-font'
        style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}
      >
        Preview:
      </span>
      <div className='d-flex gap-1 justify-content-center align-items-center text-white'>
        <Facebook style={style} />

        <Instagram style={style} />

        <YouTube style={style} />

        <Spotify style={style} />

        <AppleMusic style={style} />

        <SoundCloud style={style} />

        <X style={style} />

        <TikTok style={style} />
      </div>
    </div>
  );
};

// Visual Color Selector Component
const VisualColorSelector = ({
  label,
  value,
  onChange,
  name,
  type = 'primary',
}) => {
  const preselectedColors = getPreselectedColors(type);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorSelect = colorValue => {
    onChange({ target: { name, value: colorValue } });
  };

  const handleColorPickerChange = e => {
    onChange(e);
  };

  const currentColorName = getColorName(type, value);
  const isCustomColor = !preselectedColors.find(color => color.value === value);

  return (
    <div className='mb-sm-3 mb-2'>
      <div className='d-flex align-items-center gap-3 mb-2'>
        <label
          className='form-label mb-0'
          style={{ minWidth: '120px' }}
        >
          {label}
        </label>
      </div>

      {/* Visual Color Swatches */}
      <div className='d-flex flex-wrap gap-2 mb-2'>
        {preselectedColors.map(color => (
          <div
            key={color.value}
            className={`color-swatch ${
              value === color.value ? 'selected' : ''
            }`}
            onClick={() => handleColorSelect(color.value)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: color.value,
              border:
                value === color.value
                  ? '3px solid white'
                  : '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
            title={color.name}
          >
            {value === color.value && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                }}
              >
                ✓
              </div>
            )}
          </div>
        ))}

        {/* Custom Color Swatch */}
        <div
          className={`color-swatch ${isCustomColor ? 'selected' : ''}`}
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: isCustomColor ? value : 'transparent',
            border: isCustomColor
              ? '3px solid white'
              : '2px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            backgroundImage: isCustomColor
              ? 'none'
              : 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
          }}
          title='Custom Color'
        >
          {isCustomColor && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
              }}
            >
              ✓
            </div>
          )}
        </div>

        {/* Hidden Color Picker */}
        <input
          type='color'
          className='form-control form-control-color'
          name={name}
          value={value}
          onChange={handleColorPickerChange}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px',
          }}
          ref={input => {
            if (input && showColorPicker) {
              input.click();
              setShowColorPicker(false);
            }
          }}
        />
      </div>

      {/* Color Info */}
      <div className='d-flex align-items-center gap-2'>
        <span
          className='secondary-font'
          style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}
        >
          Selected: {currentColorName}
        </span>
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: value,
            border: '1px solid white',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
};

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
    setUploading(true);
    let bandLogoUrl = formData.bandLogoUrl;

    try {
      // Handle logo upload if there's a new file
      if (logoFile) {
        // Delete old logo if it exists
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
      const dataToSave = { ...formData, bandLogoUrl };
      await updateTheme(dataToSave);
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
      console.error('Save theme error:', err);
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
                        display: 'block',
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
                  htmlFor='greeting'
                  className='form-label'
                >
                  Greeting
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='greeting'
                  name='greeting'
                  value={formData.greeting || ''}
                  onChange={handleInputChange}
                  placeholder='Enter your greeting (e.g., HELLO., WELCOME., ROCK ON.)'
                  autoComplete='off'
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <label
                  htmlFor='introduction'
                  className='form-label'
                >
                  Introduction
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='introduction'
                  name='introduction'
                  value={formData.introduction || ''}
                  onChange={handleInputChange}
                  placeholder='Enter your introduction (e.g., We are a punk rock band from Seattle)'
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
              <VisualColorSelector
                label='Primary Color'
                value={formData.primaryColor || '#000000'}
                onChange={handleInputChange}
                name='primaryColor'
                type='primary'
              />

              <VisualColorSelector
                label='Secondary Color'
                value={formData.secondaryColor || '#000000'}
                onChange={handleInputChange}
                name='secondaryColor'
                type='secondary'
              />

              <div className='mb-sm-3 mb-2'>
                <label className='form-label'>Background Color Theme</label>
                <div className='d-flex flex-wrap gap-2'>
                  {Object.entries(themeDisplayNames).map(
                    ([name, displayName]) => {
                      const colors = getColorPalette(name);
                      return (
                        <div
                          key={name}
                          className={`color-swatch ${
                            formData.backgroundColor === name ? 'selected' : ''
                          }`}
                          onClick={() =>
                            handleInputChange({
                              target: {
                                name: 'backgroundColor',
                                value: name,
                              },
                            })
                          }
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: colors.primary,
                            border:
                              formData.backgroundColor === name
                                ? `3px solid ${colors.secondary}`
                                : '2px solid rgba(255, 255, 255, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                          }}
                          title={displayName}
                        >
                          {formData.backgroundColor === name && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
                              }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
                <div
                  className='mt-2 secondary-font'
                  style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}
                >
                  {formData.backgroundColor && (
                    <span>
                      Selected:{' '}
                      <strong>
                        {themeDisplayNames[formData.backgroundColor] ||
                          formData.backgroundColor.charAt(0).toUpperCase() +
                            formData.backgroundColor.slice(1)}
                      </strong>
                    </span>
                  )}
                </div>
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
                    <option value='sprayPaint'>SprayPaint (Custom)</option>
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
                    <option value='Orbitron'>Orbitron (Futuristic)</option>
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
                    <option value='sprayPaint'>SprayPaint (Custom)</option>
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
                    <option value='Orbitron'>Orbitron (Futuristic)</option>
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
                  <option value='colorful'>Colorful</option>
                </select>
                <SocialMediaIconPreview
                  style={formData.socialMediaIconStyle || 'default'}
                />
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
