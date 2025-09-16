'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTitle } from '../../../components/Header';
import StaticAlert from '../../../components/Alert/StaticAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';
import './Unsubscribe.css';

const Unsubscribe = () => {
  const searchParams = useSearchParams();
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
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
        const response = await fetch(
          `${baseUrl}/newsletter/unsubscribe?token=${token}`,
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
      const response = await fetch(`${baseUrl}/newsletter/unsubscribe`, {
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
            <LoadingSpinner
              size='lg'
              color='white'
              centered={true}
            />
            <p className='mt-3 secondary-font'>
              {message || 'Processing your request...'}
            </p>
          </div>
        );

      case 'verify':
        return (
          <div className='text-center'>
            <LoadingSpinner
              size='lg'
              color='white'
              centered={true}
            />
            <p className='mt-3 secondary-font'>
              Verifying your unsubscribe request...
            </p>
          </div>
        );

      case 'confirm':
        return (
          <div className='text-center'>
            <div className='text-warning mb-3'>
              <i className='fas fa-question-circle fa-3x'></i>
            </div>
            <h5 className='secondary-font text-white'>Confirm Unsubscribe</h5>
            <hr className='text-white' />
            <p className='secondary-font'>
              Are you sure you want to unsubscribe from the newsletter?
            </p>
            {/* <p className='secondary-font'>
              Email: <strong>{subscriber?.email}</strong>
            </p> */}
            <StaticAlert
              type='info'
              title='Email:'
              description={`${subscriber?.email}`}
            />
            <p className='my-4 secondary-font'>
              You will no longer receive updates about new music, shows, and
              other content.
            </p>
            <div className='d-flex justify-content-center gap-3'>
              <button
                className='btn btn-outline-light'
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
            <h5 className='secondary-font text-white'>
              Successfully Unsubscribed
            </h5>
            <hr className='text-white' />
            <StaticAlert
              type='success'
              description={message}
            />
            <p className='secondary-font mt-3'>
              You will no longer receive newsletter notifications from this
              band.
            </p>
            <p className='secondary-font'>
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
            <h5 className='secondary-font text-white'>Unsubscribe Failed</h5>
            <hr className='text-white' />
            <StaticAlert
              type='danger'
              title='Error Details'
              description={message}
            />
            <p className='secondary-font mt-3'>
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
    <div
      className='container'
      id='unsubscribe'
    >
      <PageTitle className='mb-3'>Newsletter</PageTitle>
      <div className='row justify-content-center'>
        <div className='col-md-8 col-lg-6'>
          <div className='jumbotron'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;
