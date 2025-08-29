import './Contact.css';

import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo } from '../../redux/actions';
import {
  Facebook,
  Instagram,
  YouTube,
  Spotify,
  AppleMusic,
  SoundCloud,
  X,
  TikTok,
  Envelope,
  TelephoneFill,
  PaperAirplaneSend,
} from '../../components/icons';
import Button from '../../components/Button/Button';
import { PageTitle, Divider } from '../../components/Header';
import { useAlert } from '../../contexts/AlertContext';
import { sendContactMessage } from '../../services/contactService';

const ContactPage = ({ fetchContactInfo, contactInfo, theme }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  const form = useRef();

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

  return contactInfo ? (
    <div
      className='container fadeIn'
      id='contact'
    >
      <div
        className='row'
        style={{ margin: '20px 0px', gap: '60px' }}
      >
        <div className='col-lg align-content-center'>
          <div className='jumbotron p-sm-5'>
            <PageTitle
              as='h5'
              marginClass='mb-3'
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
                    {contactInfo.publicPhone.slice(0, 3)}.
                    {contactInfo.publicPhone.slice(3, 6)}.
                    {contactInfo.publicPhone.slice(6)}
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
                    {contactInfo.publicEmail.split('@')[0]}
                    <span>@</span>
                    {contactInfo.publicEmail.split('@')[1]}
                  </a>
                </p>
                <Divider
                  className='my-4'
                  variant='white'
                />
              </>
            )}
            <div className='socmed contact'>
              {contactInfo.facebook && (
                <a
                  className='hvr-grow'
                  href={contactInfo.facebook}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Facebook style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
              {contactInfo.instagram && (
                <a
                  className='hvr-grow'
                  href={contactInfo.instagram}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Instagram style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
              {contactInfo.youtube && (
                <a
                  className='hvr-grow'
                  href={contactInfo.youtube}
                  target='_blank'
                  rel='noreferrer'
                >
                  <YouTube style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
              {contactInfo.spotify && (
                <a
                  className='hvr-grow'
                  href={contactInfo.spotify}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Spotify style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
              {contactInfo.appleMusic && (
                <a
                  className='hvr-grow'
                  href={contactInfo.appleMusic}
                  target='_blank'
                  rel='noreferrer'
                >
                  <AppleMusic
                    style={theme?.socialMediaIconStyle || 'default'}
                  />
                </a>
              )}
              {contactInfo.soundCloud && (
                <a
                  className='hvr-grow'
                  href={contactInfo.soundCloud}
                  target='_blank'
                  rel='noreferrer'
                >
                  <SoundCloud
                    style={theme?.socialMediaIconStyle || 'default'}
                  />
                </a>
              )}
              {contactInfo.x && (
                <a
                  className='hvr-grow'
                  href={contactInfo.x}
                  target='_blank'
                  rel='noreferrer'
                >
                  <X style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
              {contactInfo.tiktok && (
                <a
                  className='hvr-grow'
                  href={contactInfo.tiktok}
                  target='_blank'
                  rel='noreferrer'
                >
                  <TikTok style={theme?.socialMediaIconStyle || 'default'} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className='col-lg sendmsg align-content-center my-4'>
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
  };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactPage);
