import './BottomNav.css';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchContactInfo, fetchTheme } from '../../redux/actions';
import NavLink from '../Routing/NavLink';
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
  Envelope,
} from '../../components/icons';
import Button from '../Button/Button';
import NewsletterModal from './NewsletterModal';

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
              <NewsletterModal />
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
                  className='text-decoration-none'
                >
                  <Button
                    size='sm'
                    variant='danger'
                    type='button'
                    className='w-100'
                    as='a'
                    href='/signin'
                  >
                    Member Login
                  </Button>
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
