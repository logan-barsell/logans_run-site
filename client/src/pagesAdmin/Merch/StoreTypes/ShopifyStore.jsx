import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { updateMerchConfig } from '../../../redux/actions';
import { useAlert } from '../../../contexts/AlertContext';
import { EditableForm } from '../../../components/Forms';
import ShopifySetupGuide from '../../../components/Storefront/Guides/ShopifySetupGuide';
import ShopifyValidation from '../../../components/Storefront/Validation/ShopifyValidation';
import { SHOPIFY_FIELDS } from '../constants';

const ShopifyStore = ({ updateMerchConfig, merchConfig, forceValidation }) => {
  const { showError, showSuccess } = useAlert();

  // Memoize initial values for Shopify fields
  const initialValues = useMemo(
    () => ({
      shopDomain: merchConfig?.shopDomain || '',
      storefrontAccessToken: merchConfig?.storefrontAccessToken || '',
      collectionId: merchConfig?.collectionId || '',
    }),
    [
      merchConfig?.shopDomain,
      merchConfig?.storefrontAccessToken,
      merchConfig?.collectionId,
    ]
  );

  const handleSubmit = async values => {
    try {
      const configData = {
        storeType: 'shopify',
        shopDomain: values.shopDomain,
        storefrontAccessToken: values.storefrontAccessToken,
        collectionId: values.collectionId,
        // Preserve other store type fields
        publishableKey: merchConfig?.publishableKey || '',
        paymentLinkIds: merchConfig?.paymentLinkIds || [],
        storefrontUrl: merchConfig?.storefrontUrl || '',
      };

      await updateMerchConfig(configData);
      showSuccess('Shopify configuration updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update Shopify configuration');
    }
  };

  const handleSuccess = () => {
    // Optional: Add any success handling specific to Shopify
  };

  const handleError = error => {
    showError(error.message);
  };

  return (
    <>
      <EditableForm
        title='Shopify Configuration'
        fields={SHOPIFY_FIELDS}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {() => (
          <>
            {/* Shopify Validation */}
            <ShopifyValidation
              merchConfig={merchConfig}
              forceValidation={forceValidation}
            />
          </>
        )}
      </EditableForm>

      {/* Shopify Setup Guide */}
      <ShopifySetupGuide />
    </>
  );
};

function mapStateToProps({ merchConfig }) {
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, {
  updateMerchConfig,
})(ShopifyStore);
