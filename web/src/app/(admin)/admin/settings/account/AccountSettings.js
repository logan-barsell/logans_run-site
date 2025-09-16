'use client';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditableForm } from '../../../../../components/Forms';
import * as userService from '../../../../../services/userService';
import { updateUser as updateUserAction } from '../../../../../redux/actions/authActions';
import { useAlert } from '../../../../../contexts/AlertContext';
import { ACCOUNT_FIELDS } from './constants';
import { PageLoader } from '@/components/LoadingSpinner';

const AccountSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth?.user || null);
  const { showSuccess, showError } = useAlert();
  // Define the form fields configuration
  const accountFields = ACCOUNT_FIELDS;

  const handleSubmit = async values => {
    try {
      const updatedUser = await userService.updateUser(values);
      // Keep Redux auth.user in sync so EditableForm receives updated initialValues
      dispatch(updateUserAction(updatedUser));
      showSuccess('Account information updated successfully');
    } catch (err) {
      showError(
        err?.message ||
          'Failed to update account information. Please try again.'
      );
      throw err;
    }
  };

  // Get current user data for initial values
  const initialValues = useMemo(
    () => ({
      adminEmail: user?.adminEmail || '',
      adminPhone: user?.adminPhone || '',
    }),
    [user?.adminEmail, user?.adminPhone]
  );

  if (!user || !user.adminEmail) {
    return <PageLoader />;
  }

  return (
    <div>
      <EditableForm
        title='Admin Information'
        description='Manage your primary contact information for account management and notifications.'
        containerId='accountSettings'
        fields={accountFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        successMessage='Update Successful'
      />
    </div>
  );
};

export default AccountSettings;
