import React from 'react';

const GeneralSettings = () => {
  return (
    <div>
      <h2 className='mb-4'>⚙️ General Settings</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>General Preferences</h5>
              <p className='text-muted'>
                Configure general application settings and preferences.
              </p>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> General configuration options
                including:
                <ul className='mb-0 mt-2'>
                  <li>Language preferences</li>
                  <li>Time zone settings</li>
                  <li>Notification preferences</li>
                  <li>Privacy settings</li>
                  <li>Data export/import</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
