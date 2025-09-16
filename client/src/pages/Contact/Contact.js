import './Contact.css';

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import {
  Envelope,
  TelephoneFill,
  PaperAirplaneSend,
} from '../../components/icons';
import SocialIcons from '../../components/SocialIcons';
import Button from '../../components/Button/Button';
import { PageTitle, Divider } from '../../components/Header';
import { useAlert } from '../../contexts/AlertContext';
import { sendContactMessage } from '../../services/contactService';
import StaticAlert from '../../components/Alert/StaticAlert';
import { PageLoader } from '../../components/LoadingSpinner';

const ContactPage = ({
  fetchContactInfo,
  contactInfo,
  theme,
  loading,
  error,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAlert();
  const form = useRef();

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  // Show loading state while fetching data
  if (loading) {
    return <PageLoader />;
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        className='container fadeIn'
        id='contact'
      >
        <div className='text-center py-5'>
          <StaticAlert
            type={error.severity}
            title={error.title}
            description={error.message}
          />
        </div>
      </div>
    );
  }

  const sendEmail = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(form.current);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      title: formData.get('title'),
      message: formData.get('message'),
    };

    try {
      const result = await sendContactMessage(contactData);

      if (result.success) {
        showSuccess("Message sent successfully! We'll get back to you soon.");
        form.current.reset();
      } else {
        showError(
          result.message || 'Failed to send message. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if there's any contact information to display
  const hasContactInfo =
    contactInfo &&
    (contactInfo.publicPhone ||
      contactInfo.publicEmail ||
      contactInfo.facebook ||
      contactInfo.instagram ||
      contactInfo.youtube ||
      contactInfo.spotify ||
      contactInfo.appleMusic ||
      contactInfo.soundCloud ||
      contactInfo.x ||
      contactInfo.tiktok);
  console.log('contactInfo', contactInfo);
  return contactInfo ? (
    <div
      className='container fadeIn'
      id='contact'
    >
      <div
        className='row'
        style={{ margin: '20px 0px', gap: '60px' }}
      >
        {hasContactInfo && (
          <div className='col-lg align-content-center'>
            <div className='jumbotron p-sm-5'>
              <PageTitle
                as='h5'
                marginClass='mb-3'
                variant='white'
              >
                Contact Information
              </PageTitle>
              <Divider
                className='my-4'
                variant='white'
              />
              {contactInfo.publicPhone && (
                <>
                  <p className='secondary-font text-white'>
                    <TelephoneFill />
                    <a href={`tel:+${contactInfo.publicPhone}`}>
                      {contactInfo.publicPhone}
                    </a>
                  </p>
                  <Divider
                    className='my-4'
                    variant='white'
                  />
                </>
              )}

              {contactInfo.publicEmail && (
                <>
                  <p className='secondary-font text-white'>
                    <Envelope />
                    <a href={`mailto:${contactInfo.publicEmail}`}>
                      {contactInfo.publicEmail}
                    </a>
                  </p>
                  <Divider
                    className='my-4'
                    variant='white'
                  />
                </>
              )}
              <SocialIcons
                links={{
                  facebook: contactInfo.facebook,
                  instagram: contactInfo.instagram,
                  youtube: contactInfo.youtube,
                  spotify: contactInfo.spotify,
                  appleMusic: contactInfo.appleMusic,
                  soundCloud: contactInfo.soundCloud,
                  x: contactInfo.x,
                  tiktok: contactInfo.tiktok,
                }}
                variant='contact'
                theme={theme}
              />
            </div>
          </div>
        )}
        <div
          className={`${
            hasContactInfo ? 'col-lg' : 'col-12'
          } sendmsg align-content-center my-4`}
        >
          <form
            ref={form}
            onSubmit={sendEmail}
          >
            <PageTitle
              as='h5'
              className='text-center'
              marginClass='mb-3'
            >
              Email Us
            </PageTitle>
            <Divider
              className='mb-4'
              variant='white'
            />

            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                className='form-control'
                id='name'
                type='text'
                name='name'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email address</label>
              <input
                className='form-control'
                id='email'
                type='email'
                name='email'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='title'>Subject</label>
              <input
                className='form-control'
                id='title'
                name='title'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>Message</label>
              <textarea
                className='form-control'
                id='message'
                name='message'
                rows='3'
                required
              ></textarea>
            </div>
            <div className='d-grid gap-2'>
              <Button
                type='submit'
                value='send'
                variant='danger'
                disabled={isSubmitting}
                icon={<PaperAirplaneSend />}
                iconPosition='right'
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

function mapStateToProps({ contactInfo, theme }) {
  return {
    contactInfo: contactInfo?.data, // Access the data property from the contactInfo reducer
    theme: theme?.data || null,
    loading: contactInfo?.loading || false,
    error: contactInfo?.error || null,
  };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactPage);
