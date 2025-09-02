import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components/Header';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'verify', 'confirm', 'success', 'error'
  const [message, setMessage] = useState('');
  const [subscriber, setSubscriber] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid unsubscribe link. Missing token.');
        return;
      }

      try {
        const response = await fetch(
          `/api/newsletter/unsubscribe?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus('confirm');
          setSubscriber(data.subscriber);
          setMessage('Please confirm your unsubscribe request');
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to verify unsubscribe token');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while processing your request');
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!subscriber) return;

    try {
      setStatus('loading');
      setMessage('Processing your unsubscribe request...');

      // Call the unsubscribe API
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: subscriber.unsubscribeToken }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Successfully unsubscribed from newsletter');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to unsubscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while processing your request');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className='text-center'>
            <div
              className='spinner-border'
              role='status'
            >
              <span className='visually-hidden'>Loading...</span>
            </div>
            <p className='mt-3'>{message || 'Processing your request...'}</p>
          </div>
        );

      case 'verify':
        return (
          <div className='text-center'>
            <div
              className='spinner-border'
              role='status'
            >
              <span className='visually-hidden'>Loading...</span>
            </div>
            <p className='mt-3'>Verifying your unsubscribe request...</p>
          </div>
        );

      case 'confirm':
        return (
          <div className='text-center'>
            <div className='text-warning mb-3'>
              <i className='fas fa-question-circle fa-3x'></i>
            </div>
            <h3>Confirm Unsubscribe</h3>
            <p className='lead'>
              Are you sure you want to unsubscribe from the newsletter?
            </p>
            <p>
              Email: <strong>{subscriber?.email}</strong>
            </p>
            <p className='text-muted mb-4'>
              You will no longer receive updates about new music, shows, and
              other content.
            </p>
            <div className='d-flex justify-content-center gap-3'>
              <button
                className='btn btn-secondary'
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                className='btn btn-danger'
                onClick={handleUnsubscribe}
              >
                Unsubscribe
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className='text-center'>
            <div className='text-success mb-3'>
              <i className='fas fa-check-circle fa-3x'></i>
            </div>
            <h3>Successfully Unsubscribed</h3>
            <p className='lead'>{message}</p>
            <p>
              You will no longer receive newsletter notifications from this
              band.
            </p>
            <p className='text-muted'>
              If you change your mind, you can always sign up again through
              their website.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className='text-center'>
            <div className='text-danger mb-3'>
              <i className='fas fa-exclamation-triangle fa-3x'></i>
            </div>
            <h3>Unsubscribe Failed</h3>
            <p className='lead text-danger'>{message}</p>
            <p>
              Please try again or contact the band directly if you continue to
              have issues.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='container mt-5'>
      <PageTitle>Newsletter Unsubscribe</PageTitle>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-6'>
          <div className='card shadow'>
            <div className='card-body p-5'>{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
