import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import { updateContact } from '../../services/contactService';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';
import { CustomForm } from '../../components/Forms';

const ContactEdit = ({ fetchContactInfo, contactInfo }) => {
  const [updated, setUpdated] = useState(false);
  const [formData, setFormData] = useState({});
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  useEffect(() => {
    if (contactInfo && contactInfo[0]) {
      setFormData(contactInfo[0]);
    }
  }, [contactInfo]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setUpdated(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Normalize all URL fields before submission
      const normalizedData = {
        ...formData,
        facebook: normalizeUrl(formData.facebook),
        instagram: normalizeUrl(formData.instagram),
        youtube: normalizeUrl(formData.youtube),
        spotify: normalizeUrl(formData.spotify),
        appleMusic: normalizeUrl(formData.appleMusic),
        soundcloud: normalizeUrl(formData.soundcloud),
        x: normalizeUrl(formData.x),
        tiktok: normalizeUrl(formData.tiktok),
      };

      await updateContact(normalizedData);
      setUpdated(true);
      fetchContactInfo();
      showSuccess('Contact information updated successfully!');
    } catch (err) {
      console.error('Failed to update contact info:', err);
      showError(err.message || 'Failed to update contact information');
    }
  };

  return (
    <CustomForm
      title='Update Contact Info'
      containerId='contactEdit'
    >
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label
            htmlFor='email'
            className='form-label'
          >
            Email
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={formData.email || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='phone'
            className='form-label'
          >
            Phone
          </label>
          <input
            type='tel'
            className='form-control'
            id='phone'
            name='phone'
            value={formData.phone || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='facebook'
            className='form-label'
          >
            Facebook
          </label>
          <input
            type='text'
            className='form-control'
            id='facebook'
            name='facebook'
            value={formData.facebook || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='instagram'
            className='form-label'
          >
            Instagram
          </label>
          <input
            type='text'
            className='form-control'
            id='instagram'
            name='instagram'
            value={formData.instagram || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='youtube'
            className='form-label'
          >
            YouTube
          </label>
          <input
            type='text'
            className='form-control'
            id='youtube'
            name='youtube'
            value={formData.youtube || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='spotify'
            className='form-label'
          >
            Spotify
          </label>
          <input
            type='text'
            className='form-control'
            id='spotify'
            name='spotify'
            value={formData.spotify || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='appleMusic'
            className='form-label'
          >
            Apple Music
          </label>
          <input
            type='text'
            className='form-control'
            id='appleMusic'
            name='appleMusic'
            value={formData.appleMusic || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='soundcloud'
            className='form-label'
          >
            SoundCloud
          </label>
          <input
            type='text'
            className='form-control'
            id='soundcloud'
            name='soundcloud'
            value={formData.soundcloud || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='x'
            className='form-label'
          >
            X (Twitter)
          </label>
          <input
            type='text'
            className='form-control'
            id='x'
            name='x'
            value={formData.x || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className='mb-3'>
          <label
            htmlFor='tiktok'
            className='form-label'
          >
            TikTok
          </label>
          <input
            type='text'
            className='form-control'
            id='tiktok'
            name='tiktok'
            value={formData.tiktok || ''}
            onChange={handleInputChange}
          />
        </div>
        <button
          type='submit'
          className='btn btn-danger'
          disabled={updated}
        >
          {updated ? 'Update Successful' : 'Save Changes'}
        </button>
      </form>
    </CustomForm>
  );
};

function mapStateToProps({ contactInfo }) {
  return { contactInfo: contactInfo?.data || [] };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactEdit);
