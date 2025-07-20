import './SecondaryNav.css';

import React from 'react';
import { useNavHeight } from '../../contexts/NavHeightContext';

const SecondaryNav = ({
  label,
  options = [],
  currentTab,
  onTabClick,
  showTabs = false,
}) => {
  const { topNavHeight } = useNavHeight();

  const handleTabClick = (option, event) => {
    event.preventDefault();
    if (onTabClick) {
      onTabClick(option, event);
    }
  };

  const renderedNavItems = options.map((option, index) => {
    const active = option.toLowerCase() === currentTab ? 'active' : '';
    return (
      <li
        key={index}
        className='nav-item col-auto'
      >
        <a
          href='#!'
          className={`nav-link ${active}`}
          onClick={event => handleTabClick(option, event)}
        >
          {option}
        </a>
      </li>
    );
  });

  return (
    <ul
      className='nav secondary-nav justify-content-center'
      style={{ position: 'sticky', top: topNavHeight, zIndex: 1000 }}
    >
      {showTabs ? (
        <div className='text-center row align-items-center'>
          {renderedNavItems}
        </div>
      ) : (
        <li className='nav-item'>
          <h5 className='text-center'>{label}</h5>
        </li>
      )}
    </ul>
  );
};

export default SecondaryNav;
