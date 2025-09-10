import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { updateMerchConfig } from '../../../redux/actions';
import { useAlert } from '../../../contexts/AlertContext';
import { EditableForm } from '../../../components/Forms';
import { EXTERNAL_FIELDS } from '../constants';

const ExternalStore = ({ updateMerchConfig, merchConfig }) => {
  const { showError, showSuccess } = useAlert();

  // Memoize initial values for External Store fields
  const initialValues = useMemo(
    () => ({
      storefrontUrl: merchConfig?.storefrontUrl || '',
    }),
    [merchConfig?.storefrontUrl]
  );

  const handleSubmit = async values => {
    try {
      const configData = {
        storeType: 'external',
        storefrontUrl: values.storefrontUrl,
        // Preserve other store type fields
        shopDomain: merchConfig?.shopDomain || '',
        storefrontAccessToken: merchConfig?.storefrontAccessToken || '',
        collectionId: merchConfig?.collectionId || '',
        publishableKey: merchConfig?.publishableKey || '',
        paymentLinkIds: merchConfig?.paymentLinkIds || [],
      };

      await updateMerchConfig(configData);
      showSuccess('External store configuration updated successfully');
    } catch (error) {
      showError(
        error.message || 'Failed to update external store configuration'
      );
    }
  };

  const handleSuccess = () => {
    // Optional: Add any success handling specific to External Store
  };

  const handleError = error => {
    showError(error.message);
  };

  return (
    <EditableForm
      title='External Store Configuration'
      fields={EXTERNAL_FIELDS}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

function mapStateToProps({ merchConfig }) {
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, {
  updateMerchConfig,
})(ExternalStore);
