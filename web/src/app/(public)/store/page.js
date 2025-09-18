'use client';

import './Store.css';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPublicMerchConfig } from '../../../redux/actions';
import SecondaryNav from '../../../components/Navbar/SecondaryNav/SecondaryNav';
import ShopifyStorefront from '../../../components/Storefront/ShopifyStorefront';
import StripeStorefront from '../../../components/Storefront/StripeStorefront';
import NotFound from '../not-found';
import { shouldAllowStoreAccess } from '../../../lib/validation/merchConfigValidator';
import StaticAlert from '../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../components/LoadingSpinner';

export default function StorePage() {
  const dispatch = useDispatch();
  const merchConfig = useSelector(state => state.merchConfig?.data || null);
  const loading = useSelector(state => state.merchConfig?.loading || false);
  const error = useSelector(state => state.merchConfig?.error || null);

  useEffect(() => {
    dispatch(fetchPublicMerchConfig());
  }, [dispatch]);

  // Show loading state while fetching merch config
  if (loading) {
    return <PageLoader />;
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        id='store'
        className='fadeIn'
      >
        <div className='my-2 mb-5 my-sm-5'>
          <div className='text-center py-5'>
            <StaticAlert
              type={error.severity}
              title={error.title}
              description={error.message}
            />
          </div>
        </div>
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
        {merchConfig.storeType === 'SHOPIFY' && (
          <ShopifyStorefront
            shopDomain={merchConfig.shopDomain}
            storefrontAccessToken={merchConfig.storefrontAccessToken}
            collectionId={merchConfig.collectionId}
          />
        )}

        {merchConfig.storeType === 'STRIPE' && (
          <StripeStorefront
            paymentLinkIds={merchConfig.paymentLinkIds}
            publishableKey={merchConfig.publishableKey}
          />
        )}
      </div>
    </div>
  );
}
