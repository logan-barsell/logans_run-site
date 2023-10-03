import './SecondaryNav.css';

import React from 'react';

const SecondaryNav = ({ label }) => {
  return (
    <ul className="nav secondary-nav justify-content-center">
      <li className="nav-item">
        <h5 className="text-center">{label}</h5>
      </li>
    </ul>
  );
};

export default SecondaryNav;