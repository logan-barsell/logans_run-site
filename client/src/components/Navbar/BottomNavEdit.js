import './BottomNav.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

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
              <Button
                id='updateSettings'
                type='button'
                size='sm'
                className='mx-sm-3'
                variant='danger'
                onClick={() => navigate('/settings')}
              >
                Theme & Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNavEdit;
