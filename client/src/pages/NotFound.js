import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';
import Button from '../components/Button/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleNavigation = path => {
    navigate(path);
  };

  return (
    <div
      className='container fadeIn'
      id='not-found'
    >
      <div
        className='row'
        style={{ margin: '20px 0px', gap: '60px' }}
      >
        <div className='col-lg align-content-center'>
          <div className='jumbotron p-sm-5'>
            <div className='not-found-header text-center'>
              <div className='not-found-404'>
                <h1>4O4</h1>
              </div>

              <h5 style={{ marginTop: '20px' }}>Page Not Found</h5>
            </div>

            <hr className='my-4' />

            <p className='secondary-font'>
              Oops! Looks like you've wandered off the beaten path. The page
              you're looking for doesn't exist or has moved.
            </p>
            <hr className='my-4' />

            <div className='not-found-actions'>
              <Button
                onClick={() => handleNavigation('/')}
                className='addButton'
                variant='danger'
              >
                Back to Home
              </Button>
              <Button
                onClick={() => handleNavigation('/music')}
                className='addButton'
                variant='secondary'
              >
                Check Out Our Music
              </Button>
              <Button
                onClick={() => handleNavigation('/contact')}
                className='addButton'
                variant='dark'
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
