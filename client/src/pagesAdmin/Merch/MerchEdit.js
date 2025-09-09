import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMerchConfig, updateMerchConfig } from '../../redux/actions';
import { useAlert } from '../../contexts/AlertContext';
import { Divider } from '../../components/Header';
import StandaloneSelect from '../../components/Forms/FieldTypes/StandaloneSelect';
import ShopifyStore from './StoreTypes/ShopifyStore';
import StripeStore from './StoreTypes/StripeStore';
import ExternalStore from './StoreTypes/ExternalStore';
import { STORE_TYPE_OPTIONS } from './constants';

const MerchEdit = ({ fetchMerchConfig, updateMerchConfig, merchConfig }) => {
  const { showError, showSuccess } = useAlert();
  const [forceValidation, setForceValidation] = useState(false);
  const [selectedStoreType, setSelectedStoreType] = useState(
    merchConfig?.storeType || ''
  );

  useEffect(() => {
    fetchMerchConfig();
  }, [fetchMerchConfig]);

  useEffect(() => {
    setSelectedStoreType(merchConfig?.storeType || '');
    // Reset forceValidation when merchConfig changes from external updates
    setForceValidation(false);
  }, [merchConfig]);

  const handleStoreTypeChange = async e => {
    const newStoreType = e.target.value;
    setSelectedStoreType(newStoreType);

    if (newStoreType) {
      try {
        // Save the store type immediately
        const configData = {
          storeType: newStoreType,
          // Keep existing values for other fields
          shopDomain: merchConfig?.shopDomain || '',
          storefrontAccessToken: merchConfig?.storefrontAccessToken || '',
          collectionId: merchConfig?.collectionId || '',
          paymentLinkIds: merchConfig?.paymentLinkIds || [],
          storefrontUrl: merchConfig?.storefrontUrl || '',
        };

        await updateMerchConfig(configData);
        showSuccess('Store type updated successfully');
      } catch (error) {
        showError(error.message || 'Failed to update store type');
      }
    }
  };

  // Render the appropriate store type component
  const renderStoreComponent = () => {
    if (!selectedStoreType) {
      return (
        <div className='text-center py-5'>
          <p className='text-muted'>
            Please select a store type to configure your store.
          </p>
        </div>
      );
    }

    switch (selectedStoreType) {
      case 'shopify':
        return <ShopifyStore forceValidation={forceValidation} />;
      case 'stripe':
        return <StripeStore forceValidation={forceValidation} />;
      case 'external':
        return <ExternalStore />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Store Type Selection - outside of form */}
      <div className='container mb-5 pb-5'>
        <div className='selectCategory'>
          <StandaloneSelect
            name='storeType'
            value={selectedStoreType}
            onChange={handleStoreTypeChange}
            placeholder='Select Store Type'
            options={STORE_TYPE_OPTIONS}
          />
        </div>

        <Divider
          variant='white'
          className='w-75 mx-auto'
        />

        {/* Render the appropriate store type component */}
        {renderStoreComponent()}
      </div>
    </>
  );
};

function mapStateToProps({ merchConfig }) {
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, {
  fetchMerchConfig,
  updateMerchConfig,
})(MerchEdit);
