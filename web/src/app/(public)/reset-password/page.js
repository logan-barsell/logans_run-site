'use client';
import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../../components/Forms';
import ErrorMessage from '../../../components/ErrorMessage';
import { resetPassword } from '../../../services/authService';
import { useAlert } from '../../../contexts/AlertContext';
import Button from '../../../components/Button/Button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BackArrow } from '../../../components/icons';
import { validatePassword } from '../../../lib/validation/passwordValidation';
import PasswordField from '../../../components/Forms/FieldTypes/PasswordField';

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const { showError, showSuccess } = useAlert();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const validatePasswords = values => {
    const errors = {};

    // Validate password strength
    if (!values.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    // Validate confirm password
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const onSubmit = async values => {
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const data = await resetPassword(token, values.password);
      if (data.success) {
        setIsSuccess(true);
        showSuccess('Password reset successful! Redirecting to sign in...');
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        const errorMessage = data.error || 'Failed to reset password';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isSuccess) return 'Success!';
    if (isLoading) return 'Resetting Password...';
    return 'Reset Password';
  };

  if (!isValidToken) {
    return (
      <CustomForm
        title='Invalid Reset Link'
        className='auth-form'
        containerId='resetPasswordPage'
      >
        <div className='text-center mb-4'>
          <p className='secondary-font text-white'>
            This password reset link is invalid or has expired. Please request a
            new password reset.
          </p>
        </div>
        <div className='text-center mt-5'>
          <Link
            href='/forgot-password'
            className='text-decoration-none secondary-font text-muted d-inline-flex align-items-center gap-2'
          >
            <BackArrow />
            Back to Forgot Password
          </Link>
        </div>
      </CustomForm>
    );
  }

  return (
    <CustomForm
      title='Reset Password'
      className='auth-form'
      containerId='resetPasswordPage'
    >
      <div className='text-center mb-4'>
        <p className='secondary-font text-white small small-sm'>
          Enter your new password below.
          <br />
          Password must be at least 8 characters with uppercase, lowercase,
          number, and special character.
        </p>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validatePasswords}
        render={({ handleSubmit, submitting, hasValidationErrors, values }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div className='mb-3'>
              <PasswordField
                label='New Password'
                name='password'
                required
                placeholder='Enter your new password'
                showStrengthIndicator={true}
                validate={value => {
                  if (!value) return 'Required';
                  const validation = validatePassword(value);
                  return !validation.isValid ? validation.errors[0] : undefined;
                }}
              />
            </div>
            <div className='mb-3'>
              <PasswordField
                label='Confirm New Password'
                name='confirmPassword'
                required
                placeholder='Confirm your new password'
                validate={value => {
                  if (!value) return 'Required';
                  return values.password !== value
                    ? 'Passwords do not match'
                    : undefined;
                }}
                helperText={
                  values.confirmPassword &&
                  values.password !== values.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </div>
            <div className='d-flex flex-column gap-2'>
              <Button
                type='submit'
                variant='danger'
                disabled={
                  submitting || isLoading || isSuccess || hasValidationErrors
                }
                loading={isLoading}
              >
                {getButtonText()}
              </Button>
              <div className='text-center mt-5'>
                <Link
                  href='/signin'
                  className='text-decoration-none secondary-font text-muted d-inline-flex align-items-center gap-2'
                >
                  <BackArrow />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        )}
      />
    </CustomForm>
  );
};

export default ResetPassword;
