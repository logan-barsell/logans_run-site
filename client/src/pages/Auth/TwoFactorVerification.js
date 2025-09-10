import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../contexts/AlertContext';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button/Button';
import SaveButton from '../../components/Forms/SaveButton';
import { Link } from 'react-router-dom';
import {
  completeTwoFactorAuth,
  resendTwoFactorCode,
  checkAuthentication,
} from '../../redux/actions/authActions';

const TwoFactorVerification = () => {
  const { showSuccess, showError } = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get 2FA state from Redux
  const { twoFactor } = useSelector(state => state.auth);
  const { completing, sendingCode, error } = twoFactor;

  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // Get user data from location state
  const { userId, user, bandName } = location.state || {};

  useEffect(() => {
    if (!userId || !user) {
      navigate('/signin');
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, user, navigate]);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async values => {
    setIsSuccess(false);

    const result = await dispatch(completeTwoFactorAuth(userId, values.code));

    if (result.success) {
      setIsSuccess(true);
      showSuccess('Login successful! Redirecting...');

      // Trigger auth check after component state updates to avoid memory leak
      await dispatch(checkAuthentication());
    } else {
      showError(result.error);
    }
  };

  const handleResendCode = async () => {
    const result = await dispatch(
      resendTwoFactorCode(userId, user?.tenantId, bandName || 'Bandsyte')
    );

    if (result.success) {
      showSuccess('New verification code sent to your email');
      setTimeLeft(300); // Reset timer
      setCanResend(false);
    } else {
      showError(result.error);
    }
  };

  if (!userId || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <CustomForm
      title='Two-Factor Authentication'
      className='auth-form'
      containerId='twoFactorPage'
    >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, values }) => (
          <form
            onSubmit={handleSubmit}
            className='mt-4'
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className='mb-3'>
              <Field name='code'>
                {({ input }) => (
                  <>
                    <label
                      htmlFor='code'
                      className='form-label'
                    >
                      Verification Code
                    </label>
                    <input
                      {...input}
                      type='text'
                      className='form-control'
                      id='code'
                      maxLength='6'
                      style={{
                        fontSize: '1.5rem',
                        letterSpacing: '0.5rem',
                      }}
                      autoComplete='one-time-code'
                      autoFocus
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 6) {
                          input.onChange(value);
                        }
                      }}
                    />
                    <div className='form-text'>
                      Check your email for the 6-digit verification code
                    </div>
                  </>
                )}
              </Field>
            </div>

            <div className='d-flex flex-column gap-2'>
              <SaveButton
                hasChanges={true}
                isDirty={true}
                isSaving={completing}
                isSaved={isSuccess}
                saveText='Verify Code'
                savedText='Success!'
                savingText='Verifying...'
                buttonType='submit'
                className='btn btn-danger submitForm'
                disabled={
                  submitting ||
                  completing ||
                  isSuccess ||
                  !values?.code ||
                  values.code.length !== 6
                }
              />

              <div className='text-center mt-3'>
                {timeLeft > 0 ? (
                  <p
                    className='mb-2'
                    style={{
                      fontSize: '0.9rem',
                      color: 'white',
                      fontFamily: 'var(--secondary-font)',
                    }}
                  >
                    Code expires in: <strong>{formatTime(timeLeft)}</strong>
                  </p>
                ) : (
                  <p
                    className='text-warning mb-2 secondary-font'
                    style={{ fontSize: '0.9rem' }}
                  >
                    <strong>Code has expired</strong>
                  </p>
                )}

                <div className='d-flex flex-column gap-2 secondary-font'>
                  <Button
                    type='button'
                    variant='outline-light'
                    size='sm'
                    onClick={handleResendCode}
                    disabled={!canResend || sendingCode}
                    loading={sendingCode}
                  >
                    {sendingCode ? 'Sending...' : 'Resend Code'}
                  </Button>
                </div>

                <div className='mt-3'>
                  <Link
                    to='/signin'
                    className='text-decoration-none secondary-font text-muted'
                    style={{ fontSize: '0.9rem' }}
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </form>
        )}
      />
    </CustomForm>
  );
};

export default TwoFactorVerification;
