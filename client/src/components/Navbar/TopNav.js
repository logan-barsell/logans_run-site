import './TopNav.css';

import React, { useContext, useEffect, useRef } from 'react';
import NavLink from '../Routing/NavLink';
import { Collapse } from 'bootstrap';
import { ActiveContext } from '../../contexts/ActiveContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavHeight } from '../../contexts/NavHeightContext';

const TopNav = ({ routes }) => {
  const ref = useRef();
  const { toggle, setToggle } = useContext(ActiveContext);
  const { theme } = useTheme();
  const { setTopNavHeight } = useNavHeight();

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
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
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

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [toggle, setToggle]);

  useEffect(() => {
    const menuCollapse = document.getElementById('menu');
    const bsCollapse = new Collapse(menuCollapse, {
      toggle: false,
    });
    toggle ? bsCollapse.show() : bsCollapse.hide();

    const onBodyClick = event => {
      if (ref.current && ref.current.contains(event.target)) {
        return;
      }
      setToggle(false);
    };

    document.body.addEventListener('click', onBodyClick);

    return () => {
      document.body.removeEventListener('click', onBodyClick);
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
          <img
            src={theme.bandLogoUrl}
            alt={theme?.siteTitle || 'Band Logo'}
          />
        ) : (
          theme?.siteTitle || 'Bandsyte'
        );
      case 'band-name-and-logo':
      default:
        return (
          <>
            {theme?.bandLogoUrl && (
              <img
                src={theme.bandLogoUrl}
                alt={theme?.siteTitle || 'Band Logo'}
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
    return `header-${headerDisplay.replace(/-/g, '-')}`;
  };

  return (
    <nav
      ref={ref}
      className='navbar navbar-expand-lg navbar-light sticky-top'
    >
      <div className={`container-fluid d-flex ${getHeaderPositionClass()}`}>
        <a
          className={`navbar-brand yesdevil hvr-grow ${getHeaderDisplayClass()}`}
          href='.'
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
          <span className='navbar-toggler-icon'></span>
          <span className='hamburger-line'></span>
        </button>
        <div
          className='collapse navbar-collapse'
          id='menu'
        >
          <div className='navbar-nav justify-content-around'>
            <NavLink
              routes={routes}
              menuToggle={menuToggle}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
