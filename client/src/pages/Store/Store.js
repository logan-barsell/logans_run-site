import './Store.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPublicMerchConfig } from '../../redux/actions';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import ShopifyStorefront from '../../components/Storefront/ShopifyStorefront';
import StripeStorefront from '../../components/Storefront/StripeStorefront';
import NotFound from '../NotFound';
import { shouldAllowStoreAccess } from '../../utils/merchConfigValidator';

const StorePage = ({ fetchPublicMerchConfig, merchConfig }) => {
  useEffect(() => {
    fetchPublicMerchConfig();
  }, [fetchPublicMerchConfig]);

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
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, { fetchPublicMerchConfig })(StorePage);
