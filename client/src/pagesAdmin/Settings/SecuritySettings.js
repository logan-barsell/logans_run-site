import React from 'react';

const SecuritySettings = () => {
  return (
    <div>
      <h2 className='mb-4'>🔒 Security Settings</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Account Security</h5>
              <p className='text-muted'>
                Manage your account security settings and preferences.
              </p>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> Security configuration options
                including:
                <ul className='mb-0 mt-2'>
                  <li>Change password</li>
                  <li>Two-factor authentication (2FA)</li>
                  <li>Login history</li>
                  <li>Session management</li>
                  <li>Security notifications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
