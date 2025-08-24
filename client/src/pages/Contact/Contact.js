import './Contact.css';

import React, { useEffect, useRef } from 'react';
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
import emailjs from '@emailjs/browser';
import Button from '../../components/Button/Button';
import { PageTitle, Divider } from '../../components/Header';

const ContactPage = ({ fetchContactInfo, contactInfo }) => {
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const form = useRef();

  const sendEmail = e => {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_gibfdre', // Service ID
        'template_d0jvy6q', // Template ID
        form.current,
        'z5UnqtbNDPKNGhoGS' // Public Key
      )
      .then(
        _result => {
          alert('Message sent!');
          form.current.reset();
        },
        _error => {
          alert('Failed to send message, please try again.');
        }
      );
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
                  <Facebook />
                </a>
              )}
              {contactInfo.instagram && (
                <a
                  className='hvr-grow'
                  href={contactInfo.instagram}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Instagram />
                </a>
              )}
              {contactInfo.youtube && (
                <a
                  className='hvr-grow'
                  href={contactInfo.youtube}
                  target='_blank'
                  rel='noreferrer'
                >
                  <YouTube />
                </a>
              )}
              {contactInfo.spotify && (
                <a
                  className='hvr-grow'
                  href={contactInfo.spotify}
                  target='_blank'
                  rel='noreferrer'
                >
                  <Spotify />
                </a>
              )}
              {contactInfo.appleMusic && (
                <a
                  className='hvr-grow'
                  href={contactInfo.appleMusic}
                  target='_blank'
                  rel='noreferrer'
                >
                  <AppleMusic />
                </a>
              )}
              {contactInfo.soundcloud && (
                <a
                  className='hvr-grow'
                  href={contactInfo.soundcloud}
                  target='_blank'
                  rel='noreferrer'
                >
                  <SoundCloud />
                </a>
              )}
              {contactInfo.x && (
                <a
                  className='hvr-grow'
                  href={contactInfo.x}
                  target='_blank'
                  rel='noreferrer'
                >
                  <X />
                </a>
              )}
              {contactInfo.tiktok && (
                <a
                  className='hvr-grow'
                  href={contactInfo.tiktok}
                  target='_blank'
                  rel='noreferrer'
                >
                  <TikTok />
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
                icon={<PaperAirplaneSend />}
                iconPosition='right'
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

function mapStateToProps({ contactInfo }) {
  return { contactInfo: contactInfo?.data || null };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactPage);
