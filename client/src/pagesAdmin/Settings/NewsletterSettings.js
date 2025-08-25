import React from 'react';

const NewsletterSettings = () => {
  return (
    <div>
      <h2 className='mb-4'>📧 Newsletter Settings</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Newsletter Configuration</h5>
              <p className='text-muted'>
                Configure newsletter settings and preferences.
              </p>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> Newsletter configuration options
                including:
                <ul className='mb-0 mt-2'>
                  <li>Enable/Disable newsletter signup</li>
                  <li>Newsletter customization</li>
                  <li>Email template settings</li>
                  <li>Subscriber management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSettings;
