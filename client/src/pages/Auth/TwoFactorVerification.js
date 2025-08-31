import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';
import { CustomForm } from '../../components/Forms';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';

const TwoFactorVerification = () => {
  const { showSuccess, showError } = useAlert();
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
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
    setError(null);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/auth/complete-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          code: values.code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        showSuccess('Login successful! Redirecting...');
        setAuthenticated(true);
        setTimeout(() => {
          window.location.href = '/settings';
        }, 1000);
      } else {
        const errorMessage = data.message || 'Invalid verification code';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err.message || 'Failed to verify code. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setSendingCode(true);
    try {
      const response = await fetch('/api/2fa/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bandName: bandName || 'Bandsyte',
        }),
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('New verification code sent to your email');
        setTimeLeft(300); // Reset timer
        setCanResend(false);
      } else {
        showError(data.message || 'Failed to send new code');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      showError('Failed to send new code. Please try again.');
    } finally {
      setSendingCode(false);
    }
  };

  const getButtonText = () => {
    if (isSuccess) return 'Success!';
    if (isLoading) return 'Verifying...';
    return 'Verify Code';
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
                {({ input, meta }) => (
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
                        fontFamily: 'monospace',
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
              <Button
                type='submit'
                variant='danger'
                disabled={
                  submitting ||
                  isLoading ||
                  isSuccess ||
                  !values?.code ||
                  values.code.length !== 6
                }
                loading={isLoading}
              >
                {getButtonText()}
              </Button>

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
                    className='text-warning mb-2'
                    style={{ fontSize: '0.9rem' }}
                  >
                    <strong>Code has expired</strong>
                  </p>
                )}

                <div className='d-flex flex-column gap-2'>
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
