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

  return contactInfo[0] ? (
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
            <h5>Contact Information</h5>
            <hr className='my-4' />
            <p className='secondary-font text-white'>
              <TelephoneFill />
              <a href={`tel:+${contactInfo[0].phone}`}>
                {contactInfo[0].phone.slice(0, 3)}.
                {contactInfo[0].phone.slice(3, 6)}.
                {contactInfo[0].phone.slice(6)}
              </a>
            </p>
            <hr className='my-4' />

            <p className='secondary-font text-white'>
              <Envelope />
              <a href={`mailto:${contactInfo[0].email}`}>
                {contactInfo[0].email.split('@')[0]}
                <span>@</span>
                {contactInfo[0].email.split('@')[1]}
              </a>
            </p>
            <hr className='my-4' />
            <div className='socmed contact'>
              <a
                className='hvr-grow'
                href={contactInfo[0].facebook}
                target='_blank'
                rel='noreferrer'
              >
                <Facebook />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].instagram}
                target='_blank'
                rel='noreferrer'
              >
                <Instagram />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].youtube}
                target='_blank'
                rel='noreferrer'
              >
                <YouTube />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].spotify}
                target='_blank'
                rel='noreferrer'
              >
                <Spotify />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].appleMusic}
                target='_blank'
                rel='noreferrer'
              >
                <AppleMusic />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].soundcloud}
                target='_blank'
                rel='noreferrer'
              >
                <SoundCloud />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].x}
                target='_blank'
                rel='noreferrer'
              >
                <X />
              </a>
              <a
                className='hvr-grow'
                href={contactInfo[0].tiktok}
                target='_blank'
                rel='noreferrer'
              >
                <TikTok />
              </a>
            </div>
          </div>
        </div>
        <div className='col-lg sendmsg align-content-center my-4'>
          <form
            ref={form}
            onSubmit={sendEmail}
          >
            <h5 className='text-center'>Email Us</h5>
            <hr className='mb-4' />
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
  return { contactInfo: contactInfo?.data || [] };
}

export default connect(mapStateToProps, { fetchContactInfo })(ContactPage);
