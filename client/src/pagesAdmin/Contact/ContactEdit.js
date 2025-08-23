import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import { updateContact } from '../../services/contactService';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';
import {
  validateFacebookUrl,
  validateInstagramUrl,
  validateTikTokUrl,
  validateYouTubeSocialUrl,
  validateXUrl,
  validateSpotifySocialUrl,
  validateAppleMusicUrl,
  validateSoundCloudUrl,
  validateEmail,
  validatePhone,
  normalizePhone,
} from '../../utils/validation';

const ContactEdit = ({ fetchContactInfo, contactInfo }) => {
  const { showError, showSuccess } = useAlert();
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  // Validation functions for each field
  const validateField = (name, value) => {
    if (!value) return null; // Empty values are valid (optional fields)

    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'facebook':
        return validateFacebookUrl(value);
      case 'instagram':
        return validateInstagramUrl(value);
      case 'tiktok':
        return validateTikTokUrl(value);
      case 'youtube':
        return validateYouTubeSocialUrl(value);
      case 'x':
        return validateXUrl(value);
      case 'spotify':
        return validateSpotifySocialUrl(value);
      case 'appleMusic':
        return validateAppleMusicUrl(value);
      case 'soundcloud':
        return validateSoundCloudUrl(value);
      default:
        return null;
    }
  };

  // Handle input change with validation
  const handleInputChangeWithValidation = handleInputChange => e => {
    const { name, value } = e.target;

    // Call the original handleInputChange
    handleInputChange(e);

    // Validate the field
    const validation = validateField(name, value);

    setValidationErrors(prev => ({
      ...prev,
      [name]: validation && !validation.isValid ? validation.error : null,
    }));
  };

  // Transform data before saving (normalize URLs and phone)
  const transformData = formData => ({
    email: formData.email,
    phone: normalizePhone(formData.phone),
    facebook: normalizeUrl(formData.facebook),
    instagram: normalizeUrl(formData.instagram),
    youtube: normalizeUrl(formData.youtube),
    spotify: normalizeUrl(formData.spotify),
    appleMusic: normalizeUrl(formData.appleMusic),
    soundcloud: normalizeUrl(formData.soundcloud),
    x: normalizeUrl(formData.x),
    tiktok: normalizeUrl(formData.tiktok),
  });

  // Custom comparison function to only compare form fields
  const compareFunction = (initial, current) => {
    if (!initial || !current) return false;

    const formFields = [
      'email',
      'phone',
      'facebook',
      'instagram',
      'youtube',
      'spotify',
      'appleMusic',
      'soundcloud',
      'x',
      'tiktok',
    ];

    return formFields.every(field => {
      const initialValue = initial[field] || '';
      const currentValue = current[field] || '';
      return initialValue === currentValue;
    });
  };

  const handleSave = async data => {
    await updateContact(data);
  };

  const handleSuccess = () => {
    showSuccess('Contact information updated successfully!');
    // Fetch updated data after a short delay
    setTimeout(() => {
      fetchContactInfo();
    }, 1000);
  };

  const handleError = err => {
    showError(err.message || 'Failed to update contact information');
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Update Contact Info'
        containerId='contactEdit'
        initialData={
          contactInfo && contactInfo.length > 0 ? contactInfo[0] : null
        }
        onSave={handleSave}
        onSuccess={handleSuccess}
        onError={handleError}
        compareFunction={compareFunction}
        transformData={transformData}
      >
        {({ formData, handleInputChange }) => {
          const handleChange =
            handleInputChangeWithValidation(handleInputChange);

          return (
            <>
              <div className='mb-3'>
                <label
                  htmlFor='email'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Email
                </label>
                <input
                  type='email'
                  className={`form-control ${
                    validationErrors.email ? 'is-invalid' : ''
                  }`}
                  id='email'
                  name='email'
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder='Enter email address'
                  required
                />
                {validationErrors.email && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.email}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='phone'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Phone
                </label>
                <input
                  type='tel'
                  className={`form-control ${
                    validationErrors.phone ? 'is-invalid' : ''
                  }`}
                  id='phone'
                  name='phone'
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder='Enter phone number'
                />
                {validationErrors.phone && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.phone}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='facebook'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Facebook
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.facebook ? 'is-invalid' : ''
                  }`}
                  id='facebook'
                  name='facebook'
                  value={formData.facebook || ''}
                  onChange={handleChange}
                  placeholder='Enter Facebook URL'
                />
                {validationErrors.facebook && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.facebook}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='instagram'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Instagram
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.instagram ? 'is-invalid' : ''
                  }`}
                  id='instagram'
                  name='instagram'
                  value={formData.instagram || ''}
                  onChange={handleChange}
                  placeholder='Enter Instagram URL'
                />
                {validationErrors.instagram && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.instagram}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='youtube'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  YouTube
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.youtube ? 'is-invalid' : ''
                  }`}
                  id='youtube'
                  name='youtube'
                  value={formData.youtube || ''}
                  onChange={handleChange}
                  placeholder='Enter YouTube URL'
                />
                {validationErrors.youtube && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.youtube}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='spotify'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Spotify
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.spotify ? 'is-invalid' : ''
                  }`}
                  id='spotify'
                  name='spotify'
                  value={formData.spotify || ''}
                  onChange={handleChange}
                  placeholder='Enter Spotify URL'
                />
                {validationErrors.spotify && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.spotify}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='appleMusic'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  Apple Music
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.appleMusic ? 'is-invalid' : ''
                  }`}
                  id='appleMusic'
                  name='appleMusic'
                  value={formData.appleMusic || ''}
                  onChange={handleChange}
                  placeholder='Enter Apple Music URL'
                />
                {validationErrors.appleMusic && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.appleMusic}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='soundcloud'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  SoundCloud
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.soundcloud ? 'is-invalid' : ''
                  }`}
                  id='soundcloud'
                  name='soundcloud'
                  value={formData.soundcloud || ''}
                  onChange={handleChange}
                  placeholder='Enter SoundCloud URL'
                />
                {validationErrors.soundcloud && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.soundcloud}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='x'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  X (Twitter)
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.x ? 'is-invalid' : ''
                  }`}
                  id='x'
                  name='x'
                  value={formData.x || ''}
                  onChange={handleChange}
                  placeholder='Enter X (Twitter) URL'
                />
                {validationErrors.x && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.x}
                  </div>
                )}
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='tiktok'
                  className='form-label'
                  style={{ color: 'var(--main)' }}
                >
                  TikTok
                </label>
                <input
                  type='text'
                  className={`form-control ${
                    validationErrors.tiktok ? 'is-invalid' : ''
                  }`}
                  id='tiktok'
                  name='tiktok'
                  value={formData.tiktok || ''}
                  onChange={handleChange}
                  placeholder='Enter TikTok URL'
                />
                {validationErrors.tiktok && (
                  <div
                    className='invalid-feedback'
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.875rem',
                    }}
                  >
                    {validationErrors.tiktok}
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

function mapStateToProps({ contactInfo }) {
  return { contactInfo: contactInfo?.data || [] };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactEdit);
