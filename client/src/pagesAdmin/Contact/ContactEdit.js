import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import { updateContact } from '../../services/contactService';
import normalizeUrl from '../../utils/normalizeUrl';
import { EditableForm } from '../../components/Forms';
import { useAlert } from '../../contexts/AlertContext';
import { normalizePhone } from '../../utils/validation';
import { CONTACT_FIELDS } from './constants';

const ContactEdit = ({ fetchContactInfo, contactInfo }) => {
  const { showSuccess, showError } = useAlert();
  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  // Define the form fields configuration
  const contactFields = CONTACT_FIELDS;

  // Transform data before saving (normalize URLs and phone)
  const transformData = formData => ({
    publicEmail: formData.publicEmail,
    publicPhone: normalizePhone(formData.publicPhone),
    facebook: normalizeUrl(formData.facebook),
    instagram: normalizeUrl(formData.instagram),
    youtube: normalizeUrl(formData.youtube),
    spotify: normalizeUrl(formData.spotify),
    appleMusic: normalizeUrl(formData.appleMusic),
    soundcloud: normalizeUrl(formData.soundcloud),
    x: normalizeUrl(formData.x),
    tiktok: normalizeUrl(formData.tiktok),
  });

  const handleSubmit = async values => {
    try {
      await updateContact(values);
      showSuccess('Contact information updated successfully');
    } catch (err) {
      showError(
        err?.message ||
          'Failed to update contact information. Please try again.'
      );
      throw err;
    }
  };

  // Get current contact data for initial values
  const contactData = contactInfo || {};
  const initialValues = {
    publicEmail: contactData.publicEmail || '',
    publicPhone: contactData.publicPhone || '',
    facebook: contactData.facebook || '',
    instagram: contactData.instagram || '',
    youtube: contactData.youtube || '',
    spotify: contactData.spotify || '',
    appleMusic: contactData.appleMusic || '',
    soundcloud: contactData.soundcloud || '',
    x: contactData.x || '',
    tiktok: contactData.tiktok || '',
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Edit Contact'
        fields={contactFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        successMessage='Update Successful'
        transformData={transformData}
      />
    </div>
  );
};

function mapStateToProps({ contactInfo }) {
  return { contactInfo: contactInfo?.data || null };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactEdit);
