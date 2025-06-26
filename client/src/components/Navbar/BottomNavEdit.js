import './BottomNav.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNavEdit = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav
        id='bottomNav'
        className='navbar navbar-light justify-content-center'
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          zIndex: '1000',
          height: 'auto',
        }}
      >
        {/* Button trigger modal */}
        <div className='col-md-7'>
          <div className='row justify-content-center'>
            <div className='col-auto'>
              <button
                id='subscribe'
                type='button'
                className='btn btn-sm btn-danger mx-sm-3'
                onClick={() => navigate('/theme')}
              >
                Update &nbsp;Theme
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavEdit;
