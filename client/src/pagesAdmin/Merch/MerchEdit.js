import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMerchConfig, updateMerchConfig } from '../../redux/actions';
import StripeSetupGuide from '../../components/Storefront/Guides/StripeSetupGuide';
import ShopifySetupGuide from '../../components/Storefront/Guides/ShopifySetupGuide';
import ShopifyValidation from '../../components/Storefront/Validation/ShopifyValidation';
import StripeValidation from '../../components/Storefront/Validation/StripeValidation';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';
import { Divider } from '../../components/Header';

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
        showError(error.message);
      }
    }
  };

  const handleSaveConfig = async formData => {
    // Ensure all fields are included in the data, even if empty
    const dataToSave = {
      // Include all possible fields with their current values or empty defaults
      shopDomain: formData.shopDomain || '',
      storefrontAccessToken: formData.storefrontAccessToken || '',
      collectionId: formData.collectionId || '',
      paymentLinkIds: formData.paymentLinkIds || [],
      storefrontUrl: normalizeUrl(formData.storefrontUrl || ''),
      publishableKey: formData.publishableKey || '',
      storeType: selectedStoreType,
    };
    await updateMerchConfig(dataToSave);
  };

  const handleSuccess = () => {
    showSuccess('Merchandise configuration updated successfully');

    // Force validation after successful save for Shopify/Stripe config
    if (selectedStoreType === 'shopify' || selectedStoreType === 'stripe') {
      setForceValidation(true);
      // Reset forceValidation after a short delay
      setTimeout(() => setForceValidation(false), 100);
    }
  };

  const handleError = error => {
    showError(error.message);
  };

  // Custom comparison function for merch config
  const compareFunction = (initial, current) => {
    if (!initial || !current) return false;

    const fieldsToCompare = [
      'shopDomain',
      'storefrontAccessToken',
      'collectionId',
      'paymentLinkIds',
      'storefrontUrl',
      'publishableKey',
    ];

    return fieldsToCompare.every(field => {
      const initialValue = initial[field] || '';
      const currentValue = current[field] || '';
      return initialValue === currentValue;
    });
  };

  return (
    <>
      {/* Store Type Selection - outside of form */}
      <div className='container mb-5 pb-5'>
        <div className='selectCategory'>
          <select
            value={selectedStoreType}
            onChange={handleStoreTypeChange}
            className='form-select form-control form-select-md mb-3'
            aria-label='.form-select-lg example'
          >
            <option
              value=''
              disabled
            >
              Select Store Type
            </option>
            <option value='shopify'>Shopify</option>
            <option value='stripe'>Stripe</option>
            <option value='external'>External Store</option>
          </select>
        </div>

        <Divider />

        <EditableForm
          title='Store Configuration'
          containerId='merchConfigEdit'
          initialData={merchConfig}
          onSave={handleSaveConfig}
          onSuccess={handleSuccess}
          onError={handleError}
          compareFunction={compareFunction}
        >
          {({ formData, handleInputChange }) => (
            <>
              {/* Shopify Validation - shown when Shopify is selected */}
              {selectedStoreType === 'shopify' && (
                <ShopifyValidation
                  merchConfig={merchConfig}
                  forceValidation={forceValidation}
                />
              )}

              {/* Stripe Validation - shown when Stripe is selected */}
              {selectedStoreType === 'stripe' && (
                <StripeValidation
                  merchConfig={merchConfig}
                  forceValidation={forceValidation}
                />
              )}

              <div className='container'>
                {/* Shopify Fields */}
                {selectedStoreType === 'shopify' && (
                  <>
                    <div className='mb-sm-3 mb-2'>
                      <label
                        htmlFor='shopDomain'
                        className='form-label'
                      >
                        Shop Domain / URL
                      </label>
                      <input
                        type='text'
                        className='form-control mb-3'
                        id='shopDomain'
                        name='shopDomain'
                        value={formData.shopDomain || ''}
                        onChange={handleInputChange}
                        placeholder='your-store.myshopify.com'
                        autoComplete='off'
                        required
                      />
                    </div>
                    <div className='mb-sm-3 mb-2'>
                      <label
                        htmlFor='storefrontAccessToken'
                        className='form-label'
                      >
                        Storefront Access Token
                      </label>
                      <input
                        type='password'
                        className='form-control mb-3'
                        id='storefrontAccessToken'
                        name='storefrontAccessToken'
                        value={formData.storefrontAccessToken || ''}
                        onChange={handleInputChange}
                        placeholder='Enter your Shopify storefront access token'
                        autoComplete='off'
                        required
                      />
                    </div>
                    <div className='mb-sm-3 mb-2'>
                      <label
                        htmlFor='collectionId'
                        className='form-label'
                      >
                        Collection ID
                      </label>
                      <input
                        type='text'
                        className='form-control mb-3'
                        id='collectionId'
                        name='collectionId'
                        value={formData.collectionId || ''}
                        onChange={handleInputChange}
                        placeholder='Enter the collection ID (numbers only)'
                        autoComplete='off'
                        required
                      />
                    </div>
                  </>
                )}

                {/* Stripe Fields */}
                {selectedStoreType === 'stripe' && (
                  <>
                    <div className='mb-sm-3 mb-2'>
                      <label
                        htmlFor='publishableKey'
                        className='form-label'
                      >
                        Publishable Key
                      </label>
                      <input
                        type='text'
                        className='form-control mb-3'
                        id='publishableKey'
                        name='publishableKey'
                        value={formData.publishableKey || ''}
                        onChange={handleInputChange}
                        placeholder='pk_test_... or pk_live_...'
                        autoComplete='off'
                      />
                      <div className='form-text'>
                        Your Stripe publishable key. You can find this in your
                        Stripe dashboard under Developers &gt; API keys.
                      </div>
                    </div>
                    <div className='mb-sm-3 mb-2'>
                      <label
                        htmlFor='paymentLinkIds'
                        className='form-label'
                      >
                        Buy Button IDs
                      </label>
                      <textarea
                        className='form-control mb-3'
                        id='paymentLinkIds'
                        name='paymentLinkIds'
                        rows='6'
                        placeholder='Enter Stripe buy button IDs, one per line

Example:
buy_btn_1Rj6noHCVtmXVGiSacAIQc0j
buy_btn_1Rj6noHCVtmXVGiSacAIQc0k'
                        autoComplete='off'
                        value={
                          Array.isArray(formData.paymentLinkIds)
                            ? formData.paymentLinkIds.join('\n')
                            : ''
                        }
                        onChange={e => {
                          // Don't filter out empty lines - let user type freely
                          const lines = e.target.value.split('\n');
                          handleInputChange({
                            target: { name: 'paymentLinkIds', value: lines },
                          });
                        }}
                      />
                      <div className='form-text'>
                        Enter each Stripe buy button ID on a separate line. You
                        can find these in your Stripe dashboard under Payment
                        Links &gt; Embed.
                      </div>
                    </div>
                  </>
                )}

                {/* External Fields */}
                {selectedStoreType === 'external' && (
                  <div className='mb-sm-3 mb-2'>
                    <label
                      htmlFor='storefrontUrl'
                      className='form-label'
                    >
                      Store URL
                    </label>
                    <input
                      type='text'
                      className='form-control mb-3'
                      id='storefrontUrl'
                      name='storefrontUrl'
                      value={formData.storefrontUrl || ''}
                      onChange={handleInputChange}
                      placeholder='your-store.com or https://your-store.com'
                      autoComplete='off'
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </EditableForm>

        {/* Setup Guides - shown based on selected store type */}
        {selectedStoreType === 'stripe' && <StripeSetupGuide />}
        {selectedStoreType === 'shopify' && <ShopifySetupGuide />}
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
