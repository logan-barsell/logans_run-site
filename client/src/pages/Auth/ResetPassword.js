import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import { resetPassword } from '../../services/authService';
import { useAlert } from '../../contexts/AlertContext';
import Button from '../../components/Button/Button';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { BackArrow } from '../../components/icons';

const ResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const { showError, showSuccess } = useAlert();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const validatePasswords = values => {
    const errors = {};

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

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
          navigate('/signin');
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
            to='/forgot-password'
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
        <p className='secondary-font text-white'>
          Enter your new password below.
        </p>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validatePasswords}
        render={({ handleSubmit, submitting, hasValidationErrors }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div className='mb-3'>
              <Field name='password'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='password'
                      className='form-label'
                    >
                      New Password
                    </label>
                    <input
                      {...input}
                      type='password'
                      className={`form-control ${
                        meta.touched && meta.error ? 'is-invalid' : ''
                      }`}
                      id='password'
                      autoComplete='new-password'
                      required
                    />
                    {meta.touched && meta.error && (
                      <div
                        className='invalid-feedback d-block'
                        style={{
                          fontFamily: 'var(--secondary-font)',
                          fontSize: '0.875rem',
                        }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </>
                )}
              </Field>
            </div>
            <div className='mb-3'>
              <Field name='confirmPassword'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='confirmPassword'
                      className='form-label'
                    >
                      Confirm New Password
                    </label>
                    <input
                      {...input}
                      type='password'
                      className={`form-control ${
                        meta.touched && meta.error ? 'is-invalid' : ''
                      }`}
                      id='confirmPassword'
                      autoComplete='new-password'
                      required
                    />
                    {meta.touched && meta.error && (
                      <div
                        className='invalid-feedback d-block'
                        style={{
                          fontFamily: 'var(--secondary-font)',
                          fontSize: '0.875rem',
                        }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </>
                )}
              </Field>
            </div>
            <div className='d-flex flex-column gap-2'>
              <Button
                type='submit'
                variant={isSuccess ? 'success' : 'danger'}
                disabled={
                  submitting || isLoading || isSuccess || hasValidationErrors
                }
                loading={isLoading}
              >
                {getButtonText()}
              </Button>
              <div className='text-center mt-5'>
                <Link
                  to='/signin'
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
