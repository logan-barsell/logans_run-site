import './BottomNav.css';

import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo, fetchTheme } from '../../redux/actions';
import NavLink from '../Routing/NavLink';
import emailjs from '@emailjs/browser';
import {
  Facebook,
  Instagram,
  YouTube,
  Spotify,
  AppleMusic,
  SoundCloud,
  X,
  TikTok,
  Close,
} from '../../components/icons';

const BottomNav = ({
  routes,
  fetchContactInfo,
  fetchTheme,
  contactInfo,
  theme,
}) => {
  useEffect(() => {
    fetchContactInfo();
    fetchTheme();
  }, [fetchContactInfo, fetchTheme]);

  const newsletterForm = useRef();

  const sendNewsletter = e => {
    e.preventDefault();
    emailjs
      .sendForm(
        'service_gibfdre', // Service ID
        'template_l2r8dyy', // Newsletter Template ID
        newsletterForm.current,
        'z5UnqtbNDPKNGhoGS' // Public Key
      )
      .then(
        result => {
          alert('Thank you for subscribing!');
          newsletterForm.current.reset();
        },
        error => {
          alert('Failed to subscribe, please try again.');
        }
      );
  };

  return (
    <>
      <nav
        id='bottomNav'
        className='navbar navbar-light justify-content-center'
      >
        {/* Button trigger modal */}
        <div className='col-md-7 my-2'>
          <div className='row justify-content-center'>
            <div className='col-auto'>
              <button
                id='subscribe'
                type='button'
                className='btn btn-sm btn-danger mx-sm-3'
                data-bs-toggle='modal'
                data-bs-target='#newsletterModal'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='33'
                  height='33'
                  fill='currentColor'
                  className='bi bi-envelope-fill'
                  viewBox='0 0 16 16'
                >
                  <path d='M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z' />
                </svg>
                Newsletter
              </button>
            </div>
          </div>
        </div>

        {/* Modal  */}
        <div
          className='modal fade'
          id='newsletterModal'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header'>
                <h5
                  className='modal-title'
                  id='exampleModalLongTitle'
                >
                  NewsLetter
                </h5>

                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                >
                  <Close />
                </button>
              </div>
              <form
                className='form-inline newsletter justify-content-center'
                ref={newsletterForm}
                onSubmit={sendNewsletter}
              >
                <div className='modal-body'>
                  <div className='mx-xs-1 mx-sm-3 me-sm-5 pe-sm-5 final-form input-group'>
                    <input
                      className='form-control text-truncate'
                      name='email'
                      type='email'
                      placeholder='Enter your email here'
                      required=''
                    />
                  </div>

                  <ul id='newsDetails'>
                    <li>Stay informed on all upcoming events</li>
                    <li>
                      Recieve updates on new music releases, music videos, and
                      vlogs
                    </li>
                    <li>
                      Be notified of special deals, new merch, and giveaways
                    </li>
                  </ul>
                </div>
                <div className='modal-footer'>
                  <button
                    type='button'
                    className='btn btn-dark'
                    data-bs-dismiss='modal'
                  >
                    Close
                  </button>
                  <button
                    id='newsSub'
                    className='btn btn-outline-light my-2 my-sm-0'
                    value='send'
                    type='submit'
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {contactInfo && contactInfo[0] && (
          <div className='iconsNav col-auto justify-content-center mx-auto'>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].facebook}
            >
              <Facebook />
            </a>
            <a
              className='w'
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].instagram}
            >
              <Instagram />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].youtube}
            >
              <YouTube />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].spotify}
            >
              <Spotify />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].appleMusic}
            >
              <AppleMusic />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].soundcloud}
            >
              <SoundCloud />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].x}
            >
              <X />
            </a>
            <a
              className=''
              target='_blank'
              rel='noreferrer'
              href={contactInfo[0].tiktok}
            >
              <TikTok />
            </a>
          </div>
        )}
      </nav>
      <footer className='page-footer pt-4'>
        {/* Footer Links */}
        <div className='container-fluid text-center text-md-left'>
          <div className='row'>
            <div className='col-md-7'>
              <h5 className='text-uppercase'>HELLO.</h5>
              <p className='secondary-font'>
                {theme?.catchPhrase || 'Welcome to our site'}.
              </p>
            </div>
            <div className='col-md-5'>
              <h5 className='text-uppercase'>Links</h5>
              <ul
                id='footer-links'
                className='list-unstyled'
              >
                <li>
                  <NavLink
                    routes={routes}
                    menuToggle={false}
                    footer={true}
                  />
                </li>
              </ul>
              <div className='d-flex justify-content-center my-3'>
                <a
                  href='/signin'
                  className='btn btn-sm btn-danger btn-primary'
                >
                  Member Login
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className='footer-copyright secondary-font pb-1 pt-2 text-center'>
          <p>
            {String(new Date().getFullYear()).replace('0', 'O')} Copyright ©{' '}
            <a
              style={{ display: 'inline-block' }}
              href='.'
            >
              {process.env.REACT_APP_DOMAIN || 'your-domain.com'}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

function mapStateToProps({ contactInfo, theme }) {
  return {
    contactInfo: contactInfo?.data || [],
    theme: theme?.data || null,
  };
}

export default connect(mapStateToProps, { fetchContactInfo, fetchTheme })(
  BottomNav
);
