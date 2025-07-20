import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import { login } from '../../services/authService';
import { useAlert } from '../../contexts/AlertContext';
import Button from '../../components/Button/Button';

const Signin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useAlert();

  const onSubmit = async values => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await login(values);
      if (data.success) {
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/theme';
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

  return (
    <CustomForm
      title='Member Login'
      className='auth-form'
      containerId='signinPage'
    >
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
                {({ input, meta }) => (
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
            <div className='d-flex'>
              <Button
                type='submit'
                variant='danger'
                disabled={submitting || isLoading}
                loading={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        )}
      />
    </CustomForm>
  );
};

export default Signin;
