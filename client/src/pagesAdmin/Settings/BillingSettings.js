import React from 'react';

const BillingSettings = () => {
  return (
    <div>
      <h2 className='mb-4'>💳 Billing & Subscription</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Billing Information</h5>
              <p className='text-muted'>
                Manage your billing information and subscription details.
              </p>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> Billing configuration options
                including:
                <ul className='mb-0 mt-2'>
                  <li>Current plan details</li>
                  <li>Payment methods</li>
                  <li>Billing history</li>
                  <li>Plan upgrades/downgrades</li>
                  <li>Invoice management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
