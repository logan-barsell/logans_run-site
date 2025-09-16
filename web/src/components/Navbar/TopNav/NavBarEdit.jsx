'use client';
import './TopNav.css';

import React, { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import InstantNavLink from '../../Routing/InstantNavLink';
import { Collapse } from 'bootstrap';
import { ActiveContext } from '../../../contexts/ActiveContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavHeight } from '../../../contexts/NavHeightContext';
import { logout } from '../../../services/authService';
import Button from '../../Button/Button';

async function handleLogout() {
  try {
    await logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Logout failed:', error);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

const NavBarEdit = ({ routes }) => {
  const { theme } = useTheme();
  const { setTopNavHeight } = useNavHeight();

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
    const headerDisplay = theme?.headerDisplay || 'band-name-and-logo';

    switch (headerDisplay) {
      case 'band-name-only':
        return theme?.siteTitle || 'Bandsyte';
      case 'logo-only':
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
      case 'header-logo-only':
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
      case 'band-name-and-logo':
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
    const headerPosition = theme?.headerPosition || 'left';

    switch (headerPosition) {
      case 'center':
        return 'navbar-container-center';
      case 'right':
        return 'navbar-container-right';
      case 'left':
      default:
        return 'navbar-container-left';
    }
  };

  // Determine header display class
  const getHeaderDisplayClass = () => {
    const headerDisplay = theme?.headerDisplay || 'band-name-and-logo';
    return headerDisplay.startsWith('header-')
      ? headerDisplay.replace(/-/g, '-')
      : `header-${headerDisplay.replace(/-/g, '-')}`;
  };

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
        >
          <span className='navbar-toggler-icon'></span>
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
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                type='button'
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
