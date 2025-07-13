import React, { useEffect, useState } from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../redux/actions';
import ImageUpload from '../../components/Forms/FieldTypes/ImageUpload';
import './themeEdit.css';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';
import { useAlert } from '../../contexts/AlertContext';

const ThemeEdit = ({ theme, fetchTheme, updateTheme }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updated, setUpdated] = useState(false);
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const onSubmit = async values => {
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
      await updateTheme({ ...values, bandLogoUrl });
      showSuccess('Theme updated successfully!');
      setUpdated(true);
      setLogoFile(null);
      setUploading(false);
    } catch (err) {
      setUploading(false);
      showError(err.message || 'Failed to update theme');
    }
  };

  return (
    <div
      id='themeEdit'
      className='container textForm'
    >
      <h3>Update Theme</h3>

      <Form
        onSubmit={onSubmit}
        initialValues={theme}
        render={({ handleSubmit, form, meta }) => (
          <form onSubmit={handleSubmit}>
            <FormSpy
              subscription={{ dirtyFieldsSinceLastSubmit: true }}
              onChange={() => setUpdated(false)}
            />
            <div className='mb-sm-3 mb-2 text-white d-flex flex-column align-items-center'>
              <label className='form-label '>Band Logo</label>
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
              <ImageUpload
                name='bandLogo'
                setImage={setLogoFile}
                initialValue={theme.bandLogoUrl}
              />
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='siteTitle'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='siteTitle'
                      className='form-label'
                    >
                      Band Name
                    </label>
                    <input
                      {...input}
                      type='text'
                      className='form-control'
                      id='siteTitle'
                      autoComplete='off'
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='catchPhrase'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='catchPhrase'
                      className='form-label'
                    >
                      Catch Phrase
                    </label>
                    <input
                      {...input}
                      type='text'
                      className='form-control'
                      id='catchPhrase'
                      placeholder='Enter your catch phrase'
                      autoComplete='off'
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='primaryColor'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='primaryColor'
                      className='form-label'
                    >
                      Primary Color
                    </label>
                    <input
                      {...input}
                      type='color'
                      className='form-control form-control-color'
                      id='primaryColor'
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='secondaryColor'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='secondaryColor'
                      className='form-label'
                    >
                      Secondary Color
                    </label>
                    <input
                      {...input}
                      type='color'
                      className='form-control form-control-color'
                      id='secondaryColor'
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='primaryFont'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='primaryFont'
                      className='form-label'
                    >
                      Primary Font
                    </label>
                    <select
                      {...input}
                      className='form-control'
                      id='primaryFont'
                    >
                      <optgroup label='Custom Fonts'>
                        <option value='SprayPaint'>SprayPaint (Custom)</option>
                      </optgroup>
                      <optgroup label='Edgy/Rock'>
                        <option value='BebasNeue'>
                          Bebas Neue (Ultra Bold)
                        </option>
                        <option value='Anton'>Anton (Heavy Impact)</option>
                        <option value='Oswald'>
                          Oswald (Condensed Industrial)
                        </option>
                      </optgroup>
                      <optgroup label='60s/70s Hippy'>
                        <option value='Pacifico'>Pacifico (Hippy Vibes)</option>
                      </optgroup>
                      <optgroup label='Metal/Horror'>
                        <option value='Creepster'>
                          Creepster (Horror Metal)
                        </option>
                        <option value='Sancreek'>
                          Sancreek (Western Horror)
                        </option>
                      </optgroup>
                      <optgroup label='Punk/Graffiti'>
                        <option value='VT323'>VT323 (Retro Terminal)</option>
                      </optgroup>
                      <optgroup label='Hand-Drawn/Rock'>
                        <option value='Kalam'>Kalam (Hand-Drawn)</option>
                        <option value='IndieFlower'>
                          Indie Flower (Playful)
                        </option>
                        <option value='ArchitectsDaughter'>
                          Architects Daughter (Sketchy)
                        </option>
                        <option value='ComicNeue'>
                          Comic Neue (Comic Style)
                        </option>
                      </optgroup>
                      <optgroup label='Fun/Bold'>
                        <option value='Righteous'>
                          Righteous (Futuristic)
                        </option>
                        <option value='Lobster'>Lobster (Fun & Bold)</option>
                      </optgroup>
                      <optgroup label='Classic'>
                        <option value='Courier New'>
                          Courier New (Retro/Vintage)
                        </option>
                      </optgroup>
                    </select>
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='secondaryFont'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='secondaryFont'
                      className='form-label'
                    >
                      Secondary Font
                    </label>
                    <select
                      {...input}
                      className='form-control'
                      id='secondaryFont'
                    >
                      <option value='Courier New'>Courier New (Default)</option>
                      <option value='Fira Mono'>Fira Mono</option>
                      <option value='JetBrains Mono'>JetBrains Mono</option>
                      <option value='Roboto Mono'>Roboto Mono</option>
                    </select>
                  </>
                )}
              </Field>
            </div>
            <div className='mb-sm-3 mb-2'>
              <Field name='paceTheme'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='paceTheme'
                      className='form-label'
                    >
                      Loading Animation
                    </label>
                    <select
                      {...input}
                      className='form-control'
                      id='paceTheme'
                    >
                      <optgroup label='Center Animations'>
                        <option value='center-circle'>Center Circle</option>
                        <option value='center-simple'>Center Simple</option>
                        <option value='center-radar'>Center Radar</option>
                        <option value='center-atom'>Center Atom</option>
                      </optgroup>
                      <optgroup label='Bar Animations'>
                        <option value='loading-bar'>Loading Bar</option>
                        <option value='barber-shop'>Barber Shop</option>
                        <option value='corner-indicator'>
                          Corner Indicator
                        </option>
                        <option value='flash'>Flash</option>
                      </optgroup>
                      <optgroup label='Bounce & Material'>
                        <option value='bounce'>Bounce</option>
                        <option value='material'>Material Design</option>
                      </optgroup>
                    </select>
                  </>
                )}
              </Field>
            </div>
            <div className='d-flex gap-2'>
              <button
                type='submit'
                className='btn btn-danger'
                disabled={updated || uploading}
              >
                {updated ? (
                  <>
                    Update Successful &nbsp;
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      className='bi bi-check-lg'
                      viewBox='0 0 16 16'
                    >
                      <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z' />
                    </svg>
                  </>
                ) : uploading ? (
                  `Uploading... ${String(uploadProgress).replace('0', 'O')}%`
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || {},
});

export default connect(mapStateToProps, { fetchTheme, updateTheme })(ThemeEdit);
