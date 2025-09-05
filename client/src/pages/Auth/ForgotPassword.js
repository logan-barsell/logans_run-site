import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import { requestPasswordReset } from '../../services/authService';
import { useAlert } from '../../contexts/AlertContext';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';
import { BackArrow } from '../../components/icons';

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showError, showSuccess } = useAlert();

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
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div className='mb-3'>
              <Field name='email'>
                {({ input }) => (
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
                      className='form-control'
                      id='email'
                      autoComplete='email'
                      required
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='d-flex flex-column gap-2'>
              <Button
                type='submit'
                variant='danger'
                disabled={submitting || isLoading || isSuccess}
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

export default ForgotPassword;
