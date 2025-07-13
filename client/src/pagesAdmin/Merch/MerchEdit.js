import './merchEdit.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchMerchConfig, updateMerchConfig } from '../../redux/actions';
import { Form, Field } from 'react-final-form';
import { Check } from '../../components/icons';
import StripeSetupGuide from '../../components/Storefront/StripeSetupGuide';
import ShopifySetupGuide from '../../components/Storefront/ShopifySetupGuide';
import normalizeUrl from '../../utils/normalizeUrl';
import { useAlert } from '../../contexts/AlertContext';

const MerchEdit = ({ fetchMerchConfig, updateMerchConfig, merchConfig }) => {
  const { showError, showSuccess } = useAlert();
  const [updated, setUpdated] = useState(false);
  const [selectedStoreType, setSelectedStoreType] = useState(
    merchConfig?.storeType || ''
  );

  useEffect(() => {
    fetchMerchConfig();
  }, [fetchMerchConfig]);

  useEffect(() => {
    setSelectedStoreType(merchConfig?.storeType || '');
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

  const handleSaveConfig = async configData => {
    try {
      // Ensure all fields are included in the data, even if empty
      const dataToSave = {
        // Include all possible fields with their current values or empty defaults
        shopDomain: configData.shopDomain || '',
        storefrontAccessToken: configData.storefrontAccessToken || '',
        collectionId: configData.collectionId || '',
        paymentLinkIds: configData.paymentLinkIds || [],
        storefrontUrl: normalizeUrl(configData.storefrontUrl || ''),
        publishableKey: configData.publishableKey || '',
        storeType: selectedStoreType,
      };
      await updateMerchConfig(dataToSave);
      setUpdated(true);
      showSuccess('Merchandise configuration updated successfully');
      // Clear the success state after 3 seconds
      setTimeout(() => setUpdated(false), 3000);
    } catch (error) {
      showError(error.message);
    }
  };

  const renderShopifyFields = () => (
    <>
      <div className='mb-sm-3 mb-2'>
        <Field
          name='shopDomain'
          initialValue={merchConfig?.shopDomain || ''}
        >
          {({ input, meta }) => (
            <>
              <label
                htmlFor='shopDomain'
                className='form-label'
              >
                Shop Domain / URL
              </label>
              <input
                {...input}
                type='text'
                className='form-control mb-3'
                id='shopDomain'
                placeholder='your-store.myshopify.com'
                autoComplete='off'
                required
              />
            </>
          )}
        </Field>
      </div>
      <div className='mb-sm-3 mb-2'>
        <Field
          name='storefrontAccessToken'
          initialValue={merchConfig?.storefrontAccessToken || ''}
        >
          {({ input, meta }) => (
            <>
              <label
                htmlFor='storefrontAccessToken'
                className='form-label'
              >
                Storefront Access Token
              </label>
              <input
                {...input}
                type='password'
                className='form-control mb-3'
                id='storefrontAccessToken'
                placeholder='Enter your Shopify storefront access token'
                autoComplete='off'
                required
              />
            </>
          )}
        </Field>
      </div>
      <div className='mb-sm-3 mb-2'>
        <Field
          name='collectionId'
          initialValue={merchConfig?.collectionId || ''}
        >
          {({ input, meta }) => (
            <>
              <label
                htmlFor='collectionId'
                className='form-label'
              >
                Collection ID
              </label>
              <input
                {...input}
                type='text'
                className='form-control mb-3'
                id='collectionId'
                placeholder='Enter the collection ID (numbers only)'
                autoComplete='off'
                required
              />
            </>
          )}
        </Field>
      </div>
    </>
  );

  const renderStripeFields = () => (
    <>
      <div className='mb-sm-3 mb-2'>
        <Field
          name='publishableKey'
          initialValue={merchConfig?.publishableKey || ''}
        >
          {({ input, meta }) => (
            <>
              <label
                htmlFor='publishableKey'
                className='form-label'
              >
                Publishable Key
              </label>
              <input
                {...input}
                type='text'
                className='form-control mb-3'
                id='publishableKey'
                placeholder='pk_test_... or pk_live_...'
                autoComplete='off'
              />
              <div className='form-text'>
                Your Stripe publishable key. You can find this in your Stripe
                dashboard under Developers &gt; API keys.
              </div>
            </>
          )}
        </Field>
      </div>
      <div className='mb-sm-3 mb-2'>
        <Field
          name='paymentLinkIds'
          initialValue={merchConfig?.paymentLinkIds || []}
        >
          {({ input, meta }) => (
            <>
              <label
                htmlFor='paymentLinkIds'
                className='form-label'
              >
                Buy Button IDs
              </label>
              <textarea
                className='form-control mb-3'
                id='paymentLinkIds'
                rows='6'
                placeholder='Enter Stripe buy button IDs, one per line

Example:
buy_btn_1Rj6noHCVtmXVGiSacAIQc0j
buy_btn_1Rj6noHCVtmXVGiSacAIQc0k'
                autoComplete='off'
                value={Array.isArray(input.value) ? input.value.join('\n') : ''}
                onChange={e => {
                  // Don't filter out empty lines - let user type freely
                  const lines = e.target.value.split('\n');
                  input.onChange(lines);
                }}
              />
              <div className='form-text'>
                Enter each Stripe buy button ID on a separate line. You can find
                these in your Stripe dashboard under Payment Links &gt; Embed.
              </div>
            </>
          )}
        </Field>
      </div>
    </>
  );

  const renderExternalFields = () => (
    <div className='mb-sm-3 mb-2'>
      <Field
        name='storefrontUrl'
        initialValue={merchConfig?.storefrontUrl || ''}
      >
        {({ input, meta }) => (
          <>
            <label
              htmlFor='storefrontUrl'
              className='form-label'
            >
              Store URL
            </label>
            <input
              {...input}
              type='text'
              className='form-control mb-3'
              id='storefrontUrl'
              placeholder='your-store.com or https://your-store.com'
              autoComplete='off'
              required
            />
          </>
        )}
      </Field>
    </div>
  );

  return (
    <div
      id='merchConfigEdit'
      className='container textForm'
    >
      <h3>Store Configuration</h3>
      <hr />

      <div className='container'>
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

        <Form
          onSubmit={handleSaveConfig}
          initialValues={{ ...merchConfig, storeType: selectedStoreType }}
          render={({ handleSubmit, form, meta }) => (
            <form
              onSubmit={handleSubmit}
              autoComplete='off'
            >
              {/* FormSpy removed - was interfering with success state */}

              {/* Hidden field to include storeType in form submission */}
              <Field name='storeType'>
                {({ input }) => (
                  <input
                    {...input}
                    type='hidden'
                    value={selectedStoreType}
                  />
                )}
              </Field>

              {selectedStoreType === 'shopify' && renderShopifyFields()}
              {selectedStoreType === 'stripe' && renderStripeFields()}
              {selectedStoreType === 'external' && renderExternalFields()}

              {selectedStoreType && (
                <div className='d-grid col-12 sm:col-6 mx-auto'>
                  <button
                    type='submit'
                    className='btn btn-danger submitForm'
                    disabled={updated}
                  >
                    {updated ? (
                      <>
                        Update Successful &nbsp;
                        <Check />
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        />

        {/* Setup Guides - shown based on selected store type */}
        {selectedStoreType === 'stripe' && <StripeSetupGuide />}
        {selectedStoreType === 'shopify' && <ShopifySetupGuide />}
      </div>
    </div>
  );
};

function mapStateToProps({ merchConfig }) {
  return { merchConfig: merchConfig?.data || null };
}

export default connect(mapStateToProps, {
  fetchMerchConfig,
  updateMerchConfig,
})(MerchEdit);
