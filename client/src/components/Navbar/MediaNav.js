import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OptionsNav = () => {
  const [activeTab, setActiveTab] = useState(0);

  const navOptions = [
    {label: 'Pictures', href: '/editMedia/pictures'}, 
    {label: 'Videos', href: '/editMedia/videos'}
  ];

  const onNavClick = index => {
  
    setActiveTab(index);
    window.scrollTo({ top: 0 });
  };

  const renderedNavItems = navOptions.map((option, index) => {
    const active = index === activeTab ? 'active' : '';
    return (
    <li key={index} className="nav-item col-auto">
        <Link to={option.href} className={`nav-link ${active}`} onClick={() => onNavClick(index)}>
            {option.label}
        </Link>
    </li>
    );
  });


  return (
    <div>
      <ul className="nav main justify-content-center">
          <div className="text-center row align-items-center">
            {renderedNavItems}
          </div>
      </ul>
    </div>
  );
};

export default OptionsNav;
