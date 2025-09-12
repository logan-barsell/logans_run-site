import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import { useAlert } from '../../contexts/AlertContext';
import SaveButton from '../../components/Forms/SaveButton';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/actions/authActions';

const Signin = () => {
  const dispatch = useDispatch();
  const { loginLoading, error } = useSelector(state => state.auth);
  const { showError, showSuccess } = useAlert();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async values => {
    setIsSuccess(false);

    const result = await dispatch(loginUser(values));

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
        navigate('/2fa-verification', { state: navigationState });
        return;
      }

      // Normal login success
      setIsSuccess(true);
      showSuccess('Login successful! Redirecting...');
    } else {
      showError(result.error);
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
                isSaving={loginLoading}
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
