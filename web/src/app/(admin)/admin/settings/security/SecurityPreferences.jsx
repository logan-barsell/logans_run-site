'use client';

import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from '../../../../../contexts/AlertContext';
import {
  updateSecurityPreferencesAction,
  fetchSecurityPreferences,
} from '../../../../../redux/actions';
import { RadioField } from '../../../../../components/Forms/FieldTypes';
import { EditableForm, SaveButton } from '../../../../../components/Forms';

const SecurityPreferences = () => {
  const dispatch = useDispatch();
  const securityPreferences = useSelector(
    state =>
      state.securityPreferences || {
        data: null,
        loading: false,
        error: null,
      }
  );
  const { showSuccess, showError } = useAlert();

  // Fetch security preferences if not already loaded
  useEffect(() => {
    if (!securityPreferences?.data && !securityPreferences?.loading) {
      dispatch(fetchSecurityPreferences());
    }
  }, [securityPreferences?.data, securityPreferences?.loading, dispatch]);

  const handleSavePreferences = async formData => {
    const result = await dispatch(
      updateSecurityPreferencesAction({
        loginAlerts: formData.loginAlerts,
        twoFactorEnabled: formData.twoFactorEnabled,
      })
    );

    if (result.success) {
      showSuccess('Security preferences updated successfully');
    } else {
      showError(
        result.error?.message || 'Failed to update security preferences'
      );
    }
  };

  const initialValues = useMemo(() => {
    const values = securityPreferences?.data || {
      loginAlerts: false,
      sessionTimeout: 7,
      twoFactorEnabled: false,
    };
    return values;
  }, [
    securityPreferences?.data?.loginAlerts,
    securityPreferences?.data?.twoFactorEnabled,
  ]);

  return (
    <EditableForm
      title=''
      containerId='securityPreferences'
      fields={[]} // Using children for RadioField components
      initialValues={initialValues}
      onSubmit={handleSavePreferences}
      successMessage='Update Successful'
    >
      {({ values, form, pristine, submitting }) => {
        return (
          <>
            <div className='mb-4'>
              <RadioField
                label='Login Alerts'
                name='loginAlerts'
                initialValue={initialValues.loginAlerts}
                toggle={true}
                enabledText='Get notified when someone logs into your account'
                disabledText='No login alerts'
              />
            </div>

            <div className='mb-4'>
              <RadioField
                label='Two-Factor Authentication'
                name='twoFactorEnabled'
                initialValue={initialValues.twoFactorEnabled}
                toggle={true}
                enabledText='Email verification code required to login'
                disabledText='Email verification code not required for login'
              />
            </div>
          </>
        );
      }}
    </EditableForm>
  );
};

export default SecurityPreferences;
