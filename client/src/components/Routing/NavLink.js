import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ActiveContext } from '../../App';

const NavLink = ({ routes, menuToggle, footer }) => {
  const { setActiveIndex, activeIndex, toggle } = useContext(ActiveContext);

  const onNavClick = index => {
    setActiveIndex(index);
    if (toggle === true) {
      menuToggle();
    }
    window.scrollTo({ top: 0 });
  };

  const renderedNavItems = routes.map((route, index) => {
    const active = index === activeIndex ? 'active' : '';
    const hvrSink = menuToggle && !toggle ? 'hvr-sink' : '';

    return (
      <Link
        key={index}
        to={route.value}
        className={`nav-item nav-link ${hvrSink} ${active} ${
          footer ? 'footer-link' : ''
        }`}
        onClick={() => onNavClick(index)}
      >
        {route.name}
      </Link>
    );
  });

  return renderedNavItems;
};

export default NavLink;
