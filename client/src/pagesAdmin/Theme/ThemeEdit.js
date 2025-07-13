import React, { useEffect, useState } from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import { connect } from 'react-redux';
import { fetchTheme, updateTheme } from '../../redux/actions';
import ImageUpload from '../../components/Forms/FieldTypes/ImageUpload';
import { CustomForm } from '../../components/Forms';
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
    <CustomForm
      title='Update Theme'
      containerId='themeEdit'
    >
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
                        <option value='RobotoCondensed'>
                          Roboto Condensed (Clean)
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
                        <option value='RobotoCondensed'>
                          Roboto Condensed (Clean)
                        </option>
                      </optgroup>
                    </select>
                  </>
                )}
              </Field>
            </div>
            <div className='d-flex justify-content-center'>
              <button
                type='submit'
                className='btn btn-danger'
                disabled={uploading}
              >
                {uploading ? `Uploading... ${uploadProgress}%` : 'Save Theme'}
              </button>
            </div>
          </form>
        )}
      />
    </CustomForm>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || {},
});

export default connect(mapStateToProps, { fetchTheme, updateTheme })(ThemeEdit);
