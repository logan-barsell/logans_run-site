import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import { login } from '../../services/authService';
import { useAlert } from '../../contexts/AlertContext';
import Button from '../../components/Button/Button';
import SaveButton from '../../components/Forms/SaveButton';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();

  const onSubmit = async values => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(values);
      if (data.success) {
        // Check if 2FA is required
        if (data.requiresTwoFactor) {
          // Show success message that code was sent
          showSuccess(data.message || 'Verification code sent to your email');

          // Navigate to 2FA verification page
          navigate('/2fa-verification', {
            state: {
              userId: data.data.userId,
              user: data.data.user,
              bandName: data.data.user.bandName || 'Bandsyte',
            },
          });
          return;
        }

        // Normal login success
        setIsSuccess(true);
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/settings';
        }, 1000);
      } else {
        const errorMessage = data.error || 'Login failed';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isSuccess) return 'Success!';
    if (isLoading) return 'Logging in...';
    return 'Login';
  };

  return (
    <CustomForm
      title='Member Login'
      className='auth-form'
      containerId='signinPage'
    >
      <Form
        onSubmit={onSubmit}
        subscription={{ values: true, submitting: true }}
        render={({ handleSubmit, submitting, values }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
            onChange={() => {
              if (isSuccess) setIsSuccess(false);
            }}
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
                      autoComplete='username'
                      required
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='mb-3'>
              <Field name='password'>
                {({ input }) => (
                  <>
                    <label
                      htmlFor='password'
                      className='form-label'
                    >
                      Password
                    </label>
                    <input
                      {...input}
                      type='password'
                      className='form-control'
                      id='password'
                      autoComplete='current-password'
                      required
                    />
                  </>
                )}
              </Field>
            </div>
            <div className='d-flex flex-column gap-2'>
              <SaveButton
                hasChanges={Boolean(values?.email && values?.password)}
                isDirty={Boolean(values?.email && values?.password)}
                isSaving={isLoading}
                isSaved={isSuccess}
                saveText='Login'
                savedText='Success!'
                savingText='Logging in...'
                buttonType='submit'
                className='btn btn-danger submitForm'
              />
              <div className='text-center mt-5'>
                <Link
                  to='/forgot-password'
                  className='text-decoration-none secondary-font text-muted'
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </form>
        )}
      />
    </CustomForm>
  );
};

export default Signin;
