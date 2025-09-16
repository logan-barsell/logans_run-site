'use client';
import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../../components/Forms';
import ErrorMessage from '../../../components/ErrorMessage';
import { requestPasswordReset } from '../../../services/authService';
import { useAlert } from '../../../contexts/AlertContext';
import Button from '../../../components/Button/Button';
import Link from 'next/link';
import { BackArrow } from '../../../components/icons';
import { validateEmail } from '../../../lib/validation';

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showError, showSuccess } = useAlert();

  const validateForm = values => {
    const errors = {};

    const emailValidation = validateEmail(values.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    return errors;
  };

  const onSubmit = async values => {
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const data = await requestPasswordReset(values.email);
      if (data.success) {
        setIsSuccess(true);
        showSuccess('Password reset email sent! Check your inbox.');
      } else {
        const errorMessage = data.error || 'Failed to send reset email';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isSuccess) return 'Success!';
    if (isLoading) return 'Sending...';
    return 'Send Reset Link';
  };

  return (
    <CustomForm
      title='Forgot Password'
      className='auth-form'
      containerId='forgotPasswordPage'
    >
      <div className='text-center mb-4'>
        <p className='secondary-font text-white'>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validateForm}
        render={({ handleSubmit, submitting, hasValidationErrors, values }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div className='mb-3'>
              <Field name='email'>
                {({ input, meta }) => (
                  <>
                    <label
                      htmlFor='email'
                      className='form-label'
                    >
                      Email
                    </label>
                    <input
                      {...input}
                      type='email'
                      className={`form-control ${
                        meta.touched && meta.error ? 'is-invalid' : ''
                      }`}
                      id='email'
                      autoComplete='email'
                      required
                      onChange={e => {
                        input.onChange(e);
                        // Reset success state when user changes input
                        if (isSuccess) {
                          setIsSuccess(false);
                        }
                      }}
                    />
                    {meta.touched && meta.error && (
                      <div className='invalid-feedback d-block secondary-font'>
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
                variant='danger'
                disabled={
                  submitting ||
                  isLoading ||
                  isSuccess ||
                  hasValidationErrors ||
                  !values?.email
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

export default ForgotPassword;
