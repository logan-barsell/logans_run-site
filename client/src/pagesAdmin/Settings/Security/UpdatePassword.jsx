import React from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { changePassword } from '../../../services/userService';
import PasswordField from '../../../components/Forms/FieldTypes/PasswordField';
// import Button from '../../../components/Button/Button';
import EditableForm from '../../../components/Forms/EditableForm';
import { calculatePasswordStrength } from '../../../utils/validation/passwordValidation';

const UpdatePassword = () => {
  const { showSuccess, showError } = useAlert();

  const handlePasswordChange = async formData => {
    if (formData.newPassword !== formData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    const passwordValidation = calculatePasswordStrength(formData.newPassword);
    if (passwordValidation === 'very-weak' || passwordValidation === 'weak') {
      showError('Password is too weak. Please use a stronger password.');
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
        // const hasValidationErrors = Object.keys(errors || {}).length > 0;
        // const isCurrentPasswordFilled =
        //   values.currentPassword && values.currentPassword.trim() !== '';
        const isNewPasswordFilled =
          values.newPassword && values.newPassword.trim() !== '';
        const isConfirmPasswordFilled =
          values.confirmPassword && values.confirmPassword.trim() !== '';
        const passwordsMatch = values.newPassword === values.confirmPassword;
        const passwordStrength = isNewPasswordFilled
          ? calculatePasswordStrength(values.newPassword)
          : null;
        const isPasswordStrongEnough =
          passwordStrength &&
          passwordStrength !== 'very-weak' &&
          passwordStrength !== 'weak';
        // const isFormValid =
        //   isCurrentPasswordFilled &&
        //   isNewPasswordFilled &&
        //   isConfirmPasswordFilled &&
        //   passwordsMatch &&
        //   isPasswordStrongEnough;

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
                  const s = calculatePasswordStrength(value);
                  return s === 'very-weak' || s === 'weak'
                    ? 'Password too weak'
                    : undefined;
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
                    : isConfirmPasswordFilled && !isPasswordStrongEnough
                    ? 'New password is too weak - please choose a stronger password'
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
