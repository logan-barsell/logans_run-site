'use client';
import './TopNav.css';

import React, { useState, useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import InstantNavLink from '../../Routing/InstantNavLink';
import { Collapse } from 'bootstrap';
import { ActiveContext } from '../../../contexts/ActiveContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavHeight } from '../../../contexts/NavHeightContext';
import { logout } from '../../../services/authService';
import Button from '../../Button/Button';

const NavBarEdit = ({ routes }) => {
  const { theme } = useTheme();
  const { setTopNavHeight } = useNavHeight();

  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const { toggle, setToggle } = useContext(ActiveContext);

  const menuToggle = () => {
    setToggle(toggle => !toggle);
  };

  useEffect(() => {
    // Measure and set nav height
    const updateHeight = () => {
      if (ref.current) {
        setTopNavHeight(ref.current.offsetHeight - 1);
      }
    };
    updateHeight();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateHeight);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateHeight);
      }
    };
  }, [setTopNavHeight]);

  useEffect(() => {
    // Reset toggle state when transitioning to desktop mode
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 992; // Bootstrap's lg breakpoint
      if (isDesktop && toggle) {
        setToggle(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [toggle, setToggle]);

  useEffect(() => {
    const menuCollapse = document.getElementById('menu');
    if (menuCollapse) {
      const bsCollapse = new Collapse(menuCollapse, {
        toggle: false,
      });
      toggle ? bsCollapse.show() : bsCollapse.hide();
    }

    const onBodyClick = event => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setToggle(false);
    };

    if (typeof window !== 'undefined') {
      document.body.addEventListener('click', onBodyClick);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.removeEventListener('click', onBodyClick);
      }
    };
  });

  // Determine header display content
  const getHeaderContent = () => {
    const headerDisplay = theme?.headerDisplay || 'BAND_NAME_AND_LOGO';

    switch (headerDisplay) {
      case 'BAND_NAME_ONLY':
        return theme?.siteTitle || 'Bandsyte';
      case 'LOGO_ONLY':
        return theme?.bandLogoUrl ? (
          <Image
            src={theme.bandLogoUrl}
            alt={theme?.siteTitle || 'Band Logo'}
            width={150}
            height={50}
            style={{ maxHeight: '70px' }}
          />
        ) : (
          theme?.siteTitle || 'Bandsyte'
        );
      case 'HEADER_LOGO_ONLY':
        return theme?.bandHeaderLogoUrl ? (
          <Image
            src={theme.bandHeaderLogoUrl}
            alt={theme?.siteTitle || 'Header Logo'}
            width={150}
            height={50}
          />
        ) : (
          theme?.siteTitle || 'Bandsyte'
        );
      case 'BAND_NAME_AND_LOGO':
      default:
        return (
          <>
            {theme?.bandLogoUrl && (
              <Image
                src={theme.bandLogoUrl}
                alt={theme?.siteTitle || 'Band Logo'}
                width={150}
                height={50}
              />
            )}
            {theme?.siteTitle || 'Bandsyte'}
          </>
        );
    }
  };

  // Determine header position class
  const getHeaderPositionClass = () => {
    const headerPosition = theme?.headerPosition || 'LEFT';

    switch (headerPosition) {
      case 'CENTER':
        return 'navbar-container-center';
      case 'RIGHT':
        return 'navbar-container-right';
      case 'LEFT':
      default:
        return 'navbar-container-left';
    }
  };

  // Determine header display class - FIXED VERSION
  const getHeaderDisplayClass = () => {
    const headerDisplay = theme?.headerDisplay || 'BAND_NAME_AND_LOGO';

    // Convert ENUM values to CSS class names
    switch (headerDisplay) {
      case 'BAND_NAME_ONLY':
        return 'header-band-name-only';
      case 'BAND_NAME_AND_LOGO':
        return 'header-band-name-and-logo';
      case 'LOGO_ONLY':
      case 'HEADER_LOGO_ONLY': // Both use the same CSS class
        return 'header-logo-only';
      default:
        return 'header-band-name-and-logo';
    }
  };

  async function handleLogout() {
    try {
      setLoading(true);
      await logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav
      ref={ref}
      className='navbar navbar-expand-lg navbar-light sticky-top'
    >
      <div className={`container-fluid d-flex ${getHeaderPositionClass()}`}>
        <a
          className={`navbar-brand yesdevil hvr-grow ${getHeaderDisplayClass()}`}
          href='/admin/settings/theme'
        >
          {getHeaderContent()}
        </a>
        <button
          className='navbar-toggler'
          type='button'
          onClick={() => menuToggle()}
          aria-expanded={toggle}
          aria-label='Toggle navigation'
        >
          <span className='hamburger-line'></span>
        </button>
        <div
          className='collapse navbar-collapse'
          id='menu'
        >
          <div className='navbar-nav justify-content-around'>
            <InstantNavLink
              routes={routes}
              menuToggle={menuToggle}
            />
            <div className='nav-item nav-link'>
              <Button
                onClick={async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  await handleLogout();
                }}
                type='button'
                disabled={loading}
                loading={loading}
                size='sm'
                variant='danger'
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarEdit;
