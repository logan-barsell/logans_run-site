import './Store.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPublicMerchConfig } from '../../redux/actions';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import ShopifyStorefront from '../../components/Storefront/ShopifyStorefront';
import StripeStorefront from '../../components/Storefront/StripeStorefront';
import NotFound from '../NotFound';
import { shouldAllowStoreAccess } from '../../utils/merchConfigValidator';

const StorePage = ({ fetchPublicMerchConfig, merchConfig, loading, error }) => {
  useEffect(() => {
    fetchPublicMerchConfig();
  }, [fetchPublicMerchConfig]);

  // Show loading state while fetching merch config
  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        className='alert alert-danger'
        role='alert'
      >
        <i className='fas fa-exclamation-triangle me-2'></i>
        {error}
      </div>
    );
  }

  // If no valid config exists or config is incomplete, show 404
  if (!shouldAllowStoreAccess(merchConfig)) {
    return <NotFound />;
  }

  return (
    <div
      id='store'
      className='fadeIn'
    >
      <SecondaryNav label='Merchandise' />
      <div className='my-2 mb-5 my-sm-5'>
        {merchConfig.storeType === 'shopify' && (
          <ShopifyStorefront
            shopDomain={merchConfig.shopDomain}
            storefrontAccessToken={merchConfig.storefrontAccessToken}
            collectionId={merchConfig.collectionId}
          />
        )}

        {merchConfig.storeType === 'stripe' && (
          <StripeStorefront
            paymentLinkIds={merchConfig.paymentLinkIds}
            publishableKey={merchConfig.publishableKey}
          />
        )}
      </div>
    </div>
  );
};

function mapStateToProps({ merchConfig }) {
  return {
    merchConfig: merchConfig?.data || null,
    loading: merchConfig?.loading || false,
    error: merchConfig?.error || null,
  };
}

export default connect(mapStateToProps, { fetchPublicMerchConfig })(StorePage);
