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

  return (
    <nav
      ref={ref}
      className='navbar navbar-expand-lg navbar-light sticky-top'
    >
      <div className='container-fluid'>
        <a
          className='navbar-brand yesdevil hvr-grow'
          href='.'
        >
          {theme.siteTitle || "Logan's Run"}
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
