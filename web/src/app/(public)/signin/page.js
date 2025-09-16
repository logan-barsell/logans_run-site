'use client';
import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { CustomForm } from '../../../components/Forms';
import ErrorMessage from '../../../components/ErrorMessage';
import { useAlert } from '../../../contexts/AlertContext';
import SaveButton from '../../../components/Forms/SaveButton';
import Link from 'next/link';
import { login } from '../../../services/authService';

const Signin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirect') || '/admin/settings/theme';
  const { showError, showSuccess } = useAlert();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async values => {
    setIsSuccess(false);
    setLoading(true);

    try {
      // Call the actual login service
      const result = await login(values);

      if (result.success) {
        // Check if 2FA is required
        if (result.requiresTwoFactor) {
          const navigationState = {
            userId: result.data.userId,
            user: result.data.user,
            bandName: result.data.user.bandName || 'Bandsyte',
          };

          // Show success message that code was sent
          showSuccess(result.message || 'Verification code sent to your email');

          // Navigate to 2FA verification page
          router.push('/2fa-verification');
          return;
        }

        // Normal login success
        setIsSuccess(true);
        showSuccess('Login successful! Redirecting...');

        // Redirect to intended page
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        showError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response?.data?.message) {
        showError(err.response.data.message);
      } else if (err.message) {
        showError(err.message);
      } else {
        showError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
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
        render={({ handleSubmit, values }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
            onChange={() => {
              if (isSuccess) setIsSuccess(false);
            }}
          >
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
                isSaving={loading}
                isSaved={isSuccess}
                saveText='Login'
                savedText='Success!'
                savingText='Logging in...'
                buttonType='submit'
                className='btn btn-danger submitForm'
              />
              <div className='text-center mt-5'>
                <Link
                  href='/forgot-password'
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
