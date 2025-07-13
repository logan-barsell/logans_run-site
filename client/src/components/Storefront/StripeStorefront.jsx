import React from 'react';
import './Storefront.css';

const StripeStorefront = ({ paymentLinkIds, publishableKey }) => {
  if (!paymentLinkIds || paymentLinkIds.length === 0) {
    return (
      <div className='no-products'>
        <h3 className='no-content'>No products available</h3>
        <p>Check back soon for new merchandise!</p>
      </div>
    );
  }

  return (
    <div className='stripe-storefront'>
      <div className='container py-4'>
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-8'>
            <div className='text-center mb-4'>
              <p className='store-subtitle secondary-font'>
                Browse and purchase our merchandise securely through Stripe
              </p>
              <hr />
            </div>

            <div className='products-grid'>
              {paymentLinkIds.map((linkId, index) => (
                <div
                  key={index}
                  className='product-item'
                >
                  <stripe-buy-button
                    buy-button-id={linkId}
                    publishable-key={publishableKey}
                  ></stripe-buy-button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeStorefront;
