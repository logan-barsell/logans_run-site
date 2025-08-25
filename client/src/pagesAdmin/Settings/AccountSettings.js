import React from 'react';

const AccountSettings = () => {
  return (
    <div>
      <h2 className='mb-4'>👤 Account Settings</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Account Information</h5>
              <p className='text-muted'>
                Manage your account details and personal information.
              </p>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> Account configuration options
                including:
                <ul className='mb-0 mt-2'>
                  <li>Personal information (name, email, phone)</li>
                  <li>Band information</li>
                  <li>Profile picture</li>
                  <li>Contact preferences</li>
                  <li>Account preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
