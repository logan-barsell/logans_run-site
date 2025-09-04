import React, { useState, useEffect } from 'react';
import {
  getNewsletterSubscribers,
  getNewsletterStats,
  unsubscribeSubscriber,
} from '../../services/newsletterService';
import { useAlert } from '../../contexts/AlertContext';
import { format } from 'date-fns';
import { DataTable } from '../../components/DataTable';
import Button from '../../components/Button/Button';
import './SubscribersList.css';

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSubscribers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both subscribers and stats in parallel
      const [subscribersResponse, statsResponse] = await Promise.all([
        getNewsletterSubscribers(page, 20),
        getNewsletterStats(),
      ]);

      if (subscribersResponse.success) {
        setSubscribers(subscribersResponse.data);
        setPagination(subscribersResponse.pagination);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError('Failed to load subscribers');
      showError('Failed to load newsletter subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async subscriberId => {
    try {
      await unsubscribeSubscriber(subscriberId);
      showSuccess('Subscriber unsubscribed successfully');
      // Refresh the subscribers list
      fetchSubscribers(pagination.currentPage);
    } catch (error) {
      console.error('Error unsubscribing subscriber:', error);
      showError(error.message || 'Failed to unsubscribe subscriber');
    }
  };

  const getStatusBadge = isActive => {
    return (
      <span
        className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}
        style={{ fontSize: '0.75rem', fontFamily: 'var(--secondary-font)' }}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = dateString => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  // Define columns for the subscribers table
  const subscriberColumns = [
    {
      key: 'email',
      header: 'Email',
      render: subscriber => (
        <div className='d-flex align-items-center'>
          <i className='fas fa-envelope text-muted me-2'></i>
          <span style={{ fontFamily: 'var(--secondary-font)' }}>
            {subscriber.email}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: subscriber => getStatusBadge(subscriber.isActive),
    },
    {
      key: 'subscribedAt',
      header: 'Subscribed',
      render: subscriber => (
        <small
          style={{
            fontFamily: 'var(--secondary-font)',
            color: 'white',
          }}
        >
          {formatDate(subscriber.subscribedAt)}
        </small>
      ),
    },
    {
      key: 'lastEmailSent',
      header: 'Last Email',
      render: subscriber => (
        <small
          style={{
            fontFamily: 'var(--secondary-font)',
            color: 'white',
          }}
        >
          {subscriber.lastEmailSent
            ? formatDate(subscriber.lastEmailSent)
            : 'Never'}
        </small>
      ),
    },
  ];

  // Define row actions for the subscribers table
  const subscriberRowActions = subscriber => {
    if (!subscriber.isActive) {
      return (
        <Button
          variant='outline-secondary'
          size='sm'
          disabled={true}
        >
          Unsubscribed
        </Button>
      );
    }

    return (
      <Button
        variant='outline-danger'
        size='sm'
        onClick={() => handleUnsubscribe(subscriber._id)}
      >
        Unsubscribe
      </Button>
    );
  };

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='alert alert-danger'
        role='alert'
      >
        <i className='fas fa-exclamation-triangle me-2'></i>
        {error}
      </div>
    );
  }

  return (
    <div className='mt-4 subscribers-list-wrapper'>
      {/* Statistics Cards */}
      {stats && (
        <div className='row mb-4'>
          <div
            className='col-lg-4 mb-3'
            style={{ paddingRight: '8px' }}
          >
            <div
              className='card h-100'
              style={{
                backgroundColor: 'var(--accordion-content-bg)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className='card-body text-center'>
                <h5
                  className='card-title mb-2'
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  <i className='fas fa-users me-2'></i>
                  Total Subscribers
                </h5>
                <h3
                  className='mb-0'
                  style={{
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--secondary-font)',
                  }}
                >
                  {stats.total}
                </h3>
              </div>
            </div>
          </div>
          <div
            className='col-lg-4 mb-3'
            style={{ paddingLeft: '4px', paddingRight: '4px' }}
          >
            <div
              className='card h-100'
              style={{
                backgroundColor: 'var(--accordion-content-bg)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className='card-body text-center'>
                <h5
                  className='card-title mb-2'
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  <i className='fas fa-check-circle me-2'></i>
                  Active Subscribers
                </h5>
                <h3
                  className='mb-0'
                  style={{
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--secondary-font)',
                  }}
                >
                  {stats.active}
                </h3>
              </div>
            </div>
          </div>
          <div
            className='col-lg-4 mb-3'
            style={{ paddingLeft: '8px' }}
          >
            <div
              className='card h-100'
              style={{
                backgroundColor: 'var(--accordion-content-bg)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className='card-body text-center'>
                <h5
                  className='card-title mb-2'
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  <i className='fas fa-calendar-plus me-2'></i>
                  New This Month
                </h5>
                <h3
                  className='mb-0'
                  style={{
                    color: 'var(--primary-color)',
                    fontFamily: 'var(--secondary-font)',
                  }}
                >
                  {stats.recent}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        title={`Newsletter Subscribers (${pagination.totalSubscribers})`}
        data={subscribers}
        columns={subscriberColumns}
        loading={loading}
        error={error}
        emptyMessage='No subscribers found'
        emptyIcon='fas fa-inbox'
        pagination={pagination}
        onPageChange={fetchSubscribers}
        rowActions={subscriberRowActions}
        getRowKey={subscriber => subscriber._id}
      />
    </div>
  );
};

export default SubscribersList;
