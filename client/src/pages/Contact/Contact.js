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
} from '../../components/icons';
import emailjs from '@emailjs/browser';

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
        result => {
          alert('Message sent!');
          form.current.reset();
        },
        error => {
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
            <p className='secondary-font'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='33'
                height='33'
                fill='white'
                className='bi bi-telephone-fill'
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z'
                />
              </svg>
              <a href={`tel:+${contactInfo[0].phone}`}>
                {contactInfo[0].phone.slice(0, 3)}.
                {contactInfo[0].phone.slice(3, 6)}.
                {contactInfo[0].phone.slice(6)}
              </a>
            </p>
            <hr className='my-4' />

            <p className='secondary-font'>
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
              <button
                className='btn btn-primary btn-danger'
                type='submit'
                value='send'
              >
                Send
              </button>
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
