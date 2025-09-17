'use client';

import React from 'react';
import { useAlert } from '../../../../../contexts/AlertContext';
import { changePassword } from '../../../../../services/userService';
import PasswordField from '../../../../../components/Forms/FieldTypes/PasswordField';
import EditableForm from '../../../../../components/Forms/EditableForm';
import { validatePassword } from '../../../../../lib/validation/passwordValidation';

const UpdatePassword = () => {
  const { showSuccess, showError } = useAlert();

  const handlePasswordChange = async formData => {
    if (formData.newPassword !== formData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      showError(passwordValidation.errors[0]);
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      showSuccess('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      showError(error.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <EditableForm
      title=''
      containerId='passwordChange'
      fields={[]}
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      onSubmit={handlePasswordChange}
      onSuccess={form => {
        // Reset the form to empty fields after successful password change
        form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }}
      successMessage='Update Successful'
    >
      {({ values, form, pristine, submitting, errors }) => {
        // Enhanced validation
        const isNewPasswordFilled =
          values.newPassword && values.newPassword.trim() !== '';
        const isConfirmPasswordFilled =
          values.confirmPassword && values.confirmPassword.trim() !== '';
        const passwordsMatch = values.newPassword === values.confirmPassword;
        const passwordValidation = isNewPasswordFilled
          ? validatePassword(values.newPassword)
          : null;
        const isPasswordValid =
          passwordValidation && passwordValidation.isValid;

        return (
          <>
            <div className='mb-sm-3 mb-2'>
              <PasswordField
                label='Current Password'
                name='currentPassword'
                required
                placeholder='Enter your current password'
                validate={value => (!value ? 'Required' : undefined)}
              />
            </div>

            <div className='mb-sm-3 mb-2'>
              <PasswordField
                label='New Password'
                name='newPassword'
                required
                placeholder='Enter your new password'
                showStrengthIndicator={true}
                showRequirements={true}
                validate={value => {
                  if (!value) return 'Required';
                  const validation = validatePassword(value);
                  return !validation.isValid ? validation.errors[0] : undefined;
                }}
              />
            </div>

            <div className='mb-sm-3 mb-2'>
              <PasswordField
                label='Confirm New Password'
                name='confirmPassword'
                required
                placeholder='Confirm your new password'
                validate={value => {
                  if (!value) return 'Required';
                  return values.newPassword !== value
                    ? 'Passwords do not match'
                    : undefined;
                }}
                helperText={
                  isConfirmPasswordFilled && !passwordsMatch
                    ? 'Passwords do not match'
                    : isConfirmPasswordFilled && !isPasswordValid
                    ? 'New password does not meet requirements'
                    : ''
                }
              />
            </div>
          </>
        );
      }}
    </EditableForm>
  );
};

export default UpdatePassword;
