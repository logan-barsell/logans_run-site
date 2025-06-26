import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import './signin.css';

const Signin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async values => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        // Instead of reloading, trigger a new auth check
        window.location.href = '/theme';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='container textForm'
      id='signinPage'
    >
      <h3>Member Login</h3>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && (
              <div className='red text-center secondary-font mb-2'>{error}</div>
            )}
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
              <button
                type='submit'
                className='btn btn-danger'
                disabled={submitting || isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default Signin;
