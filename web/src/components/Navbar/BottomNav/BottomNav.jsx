'use client';
import './BottomNav.css';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { fetchContactInfo, fetchTheme } from '../../../redux/actions';
import PublicNavLink from '../../Routing/PublicNavLink.jsx';
import SocialIcons from '../../SocialIcons';
import Button from '../../Button/Button';
import NewsletterModal from './NewsletterModal';

const BottomNav = ({ routes }) => {
  const dispatch = useDispatch();
  const contactInfo = useSelector(state => state.contactInfo?.data || null);
  const theme = useSelector(state => state.theme?.data || null);

  useEffect(() => {
    dispatch(fetchContactInfo());
    dispatch(fetchTheme());
  }, [dispatch]);

  // Check if there are any social media links to display
  const hasSocialLinks =
    contactInfo &&
    (contactInfo.facebook ||
      contactInfo.instagram ||
      contactInfo.youtube ||
      contactInfo.spotify ||
      contactInfo.appleMusic ||
      contactInfo.soundCloud ||
      contactInfo.x ||
      contactInfo.tiktok);

  return (
    <>
      <nav
        id='bottomNav'
        className='navbar navbar-light justify-content-center'
      >
        {/* Button trigger modal */}
        {theme?.enableNewsletter !== false && (
          <div
            className={`${hasSocialLinks ? 'col-md-7' : 'col-12'} col-12 my-2`}
          >
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <NewsletterModal />
              </div>
            </div>
          </div>
        )}

        {hasSocialLinks && (
          <div
            className={`${
              theme?.enableNewsletter !== false ? 'col-md-5' : 'col-md-12'
            } col-12 justify-content-center mx-auto`}
          >
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
              variant='footer'
              theme={theme}
            />
          </div>
        )}
      </nav>
      <footer className='page-footer pt-4'>
        {/* Footer Links */}
        <div className='container-fluid text-center text-md-left'>
          <div className='row'>
            <div className='col-md-7'>
              <h5 className='text-uppercase'>{theme?.greeting || 'HELLO.'}</h5>
              <p className='secondary-font'>
                {theme?.introduction || 'Welcome to our site'}.
              </p>
            </div>
            <div className='col-md-5'>
              <h5 className='text-uppercase'>Links</h5>
              <ul
                id='footer-links'
                className='list-unstyled'
              >
                <li>
                  <PublicNavLink
                    routes={routes}
                    menuToggle={false}
                    footer={true}
                  />
                </li>
              </ul>
              <div className='d-flex justify-content-center my-3'>
                <div>
                  <Button
                    size='sm'
                    variant='danger'
                    type='button'
                    className='w-100 text-decoration-none'
                    as={Link}
                    href='/signin'
                  >
                    Member Login
                  </Button>
                </div>
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
              {theme?.siteTitle || 'Bandsyte'}
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

export default BottomNav;
