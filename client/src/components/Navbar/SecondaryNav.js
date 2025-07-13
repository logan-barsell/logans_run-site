import './SecondaryNav.css';

import React from 'react';
import { useNavHeight } from '../../contexts/NavHeightContext';

const SecondaryNav = ({ label }) => {
  const { topNavHeight } = useNavHeight();
  return (
    <ul
      className='nav secondary-nav justify-content-center'
      style={{ position: 'sticky', top: topNavHeight, zIndex: 1000 }}
    >
      <li className='nav-item'>
        <h5 className='text-center'>{label}</h5>
      </li>
    </ul>
  );
};

export default SecondaryNav;
