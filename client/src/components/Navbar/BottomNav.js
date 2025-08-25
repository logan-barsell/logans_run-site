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
              {theme?.newsletterEnabled !== false && <NewsletterModal />}
            </div>
          </div>
        </div>

        {contactInfo && (
          <div className='iconsNav col-auto justify-content-center mx-auto'>
            {contactInfo.facebook && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.facebook}
              >
                <Facebook />
              </a>
            )}
            {contactInfo.instagram && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.instagram}
              >
                <Instagram />
              </a>
            )}
            {contactInfo.youtube && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.youtube}
              >
                <YouTube />
              </a>
            )}
            {contactInfo.spotify && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.spotify}
              >
                <Spotify />
              </a>
            )}
            {contactInfo.appleMusic && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.appleMusic}
              >
                <AppleMusic />
              </a>
            )}
            {contactInfo.soundCloud && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.soundCloud}
              >
                <SoundCloud />
              </a>
            )}
            {contactInfo.x && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.x}
              >
                <X />
              </a>
            )}
            {contactInfo.tikTok && (
              <a
                className=''
                target='_blank'
                rel='noreferrer'
                href={contactInfo.tikTok}
              >
                <TikTok />
              </a>
            )}
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
        {/* Powered by Bandsyte */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 0',
            textAlign: 'center',
          }}
        >
          <p
            className='secondary-font'
            style={{ marginBottom: '0' }}
          >
            Powered by{' '}
            <a
              href='https://bandsyte.com'
              target='_blank'
              rel='noopener noreferrer'
              style={{
                color: 'var(--main)',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Bandsyte
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

function mapStateToProps({ contactInfo, theme }) {
  return {
    contactInfo: contactInfo?.data || null,
    theme: theme?.data || null,
  };
}

export default connect(mapStateToProps, { fetchContactInfo, fetchTheme })(
  BottomNav
);
