'use client';
import React from 'react';
import '../../app/not-found/NotFound.css';

const NotFound = ({ variant = 'public', onNavigate }) => {
  const handleNavigation = path => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleNavigation('/admin');
    }
  };

  const renderActions = () => {
    if (variant === 'admin') {
      return (
        <div className='not-found-actions'>
          <button
            onClick={handleGoBack}
            className='btn btn-danger addButton'
            style={{ margin: '10px auto', maxWidth: '420px' }}
          >
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className='not-found-actions'>
        <button
          onClick={() => handleNavigation('/')}
          className='btn btn-danger addButton'
          style={{ margin: '10px auto', maxWidth: '420px' }}
        >
          Back to Home
        </button>
        <button
          onClick={() => handleNavigation('/music')}
          className='btn btn-secondary addButton'
          style={{ margin: '10px auto', maxWidth: '420px' }}
        >
          Check Out Our Music
        </button>
        <button
          onClick={() => handleNavigation('/contact')}
          className='btn btn-dark addButton'
          style={{ margin: '10px auto', maxWidth: '420px' }}
        >
          Get in Touch
        </button>
      </div>
    );
  };

  const getMessage = () => {
    if (variant === 'admin') {
      return "The admin page you're looking for doesn't exist or has moved.";
    }
    return "Oops! Looks like you've wandered off the beaten path. The page you're looking for doesn't exist or has moved.";
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

              <h5
                className='text-uppercase'
                style={{
                  marginTop: '20px',
                  color: 'var(--main)',
                  textShadow: '2px 1px black',
                }}
              >
                Page Not Found
              </h5>
            </div>

            <hr
              className='my-4'
              style={{ backgroundColor: 'white' }}
            />

            <p
              className='secondary-font text-center'
              style={{ color: 'white', padding: '0px 10px' }}
            >
              {getMessage()}
            </p>
            <hr
              className='my-4'
              style={{ backgroundColor: 'white' }}
            />

            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
