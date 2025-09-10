import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { updateMerchConfig } from '../../../redux/actions';
import { useAlert } from '../../../contexts/AlertContext';
import { EditableForm } from '../../../components/Forms';
import StripeSetupGuide from '../../../components/Storefront/Guides/StripeSetupGuide';
import StripeValidation from '../../../components/Storefront/Validation/StripeValidation';
import { STRIPE_FIELDS } from '../constants';

const StripeStore = ({ updateMerchConfig, merchConfig, forceValidation }) => {
  const { showError, showSuccess } = useAlert();

  // Memoize initial values for Stripe fields
  const initialValues = useMemo(
    () => ({
      publishableKey: merchConfig?.publishableKey || '',
      paymentLinkIds: Array.isArray(merchConfig?.paymentLinkIds)
        ? merchConfig.paymentLinkIds.join('\n')
        : merchConfig?.paymentLinkIds || '',
    }),
    [merchConfig?.publishableKey, merchConfig?.paymentLinkIds]
  );

  const handleSubmit = async values => {
    try {
      // Convert paymentLinkIds from newline-separated string to array
      const paymentLinkIdsArray = values.paymentLinkIds
        ? values.paymentLinkIds.split('\n').filter(id => id.trim())
        : [];

      const configData = {
        storeType: 'stripe',
        publishableKey: values.publishableKey,
        paymentLinkIds: paymentLinkIdsArray,
        // Preserve other store type fields
        shopDomain: merchConfig?.shopDomain || '',
        storefrontAccessToken: merchConfig?.storefrontAccessToken || '',
        collectionId: merchConfig?.collectionId || '',
        storefrontUrl: merchConfig?.storefrontUrl || '',
      };

      await updateMerchConfig(configData);
      showSuccess('Stripe configuration updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update Stripe configuration');
    }
  };

  const handleSuccess = () => {
    // Optional: Add any success handling specific to Stripe
  };

  const handleError = error => {
    showError(error.message);
  };

  return (
    <>
      <EditableForm
        title='Stripe Configuration'
        fields={STRIPE_FIELDS}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {() => (
          <>
            {/* Stripe Validation */}
            <StripeValidation
              merchConfig={merchConfig}
              forceValidation={forceValidation}
            />
          </>
        )}
      </EditableForm>

      {/* Stripe Setup Guide */}
      <StripeSetupGuide />
    </>
  );
};

function mapStateToProps({ merchConfig }) {
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, {
  updateMerchConfig,
})(StripeStore);
