import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  fetchNewsletterSubscribers,
  fetchNewsletterStats,
  removeNewsletterSubscriberAction,
} from '../../redux/actions';
import { useAlert } from '../../contexts/AlertContext';
import { format } from 'date-fns';
import { DataTable } from '../../components/DataTable';
import Button from '../../components/Button/Button';
import StaticAlert from '../../components/Alert/StaticAlert';
import './SubscribersList.css';

const SubscribersList = ({
  fetchNewsletterSubscribers,
  fetchNewsletterStats,
  removeNewsletterSubscriberAction,
  newsletter,
}) => {
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchNewsletterSubscribers(1, 20);
    fetchNewsletterStats();
  }, [fetchNewsletterSubscribers, fetchNewsletterStats]);

  const fetchSubscribers = (page = 1) => {
    fetchNewsletterSubscribers(page, 20);
  };

  const handleUnsubscribe = async subscriberId => {
    const result = await removeNewsletterSubscriberAction(subscriberId);
    if (result.success) {
      showSuccess('Subscriber unsubscribed successfully');
      // Refresh the subscribers list
      fetchSubscribers(newsletter.pagination.currentPage);
    } else {
      showError(result.error?.message || 'Failed to unsubscribe subscriber');
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

  if (newsletter.loading) {
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

  if (newsletter.error) {
    return (
      <StaticAlert
        type={newsletter.error.severity}
        title={newsletter.error.title}
        description={newsletter.error.message}
      />
    );
  }

  return (
    <div className='mt-4 subscribers-list-wrapper'>
      {/* Statistics Cards */}
      {newsletter.stats && (
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
                  {newsletter.stats.total}
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
                  {newsletter.stats.active}
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
                  {newsletter.stats.recent}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        title={`Newsletter Subscribers (${newsletter.pagination.totalSubscribers})`}
        data={newsletter.data}
        columns={subscriberColumns}
        loading={newsletter.loading}
        error={newsletter.error}
        emptyMessage='No subscribers found'
        emptyIcon='fas fa-inbox'
        pagination={newsletter.pagination}
        onPageChange={fetchSubscribers}
        rowActions={subscriberRowActions}
        getRowKey={subscriber => subscriber._id}
      />
    </div>
  );
};

function mapStateToProps({ newsletter }) {
  return {
    newsletter: newsletter || {
      data: [],
      loading: false,
      error: null,
      stats: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalSubscribers: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  };
}

export default connect(mapStateToProps, {
  fetchNewsletterSubscribers,
  fetchNewsletterStats,
  removeNewsletterSubscriberAction,
})(SubscribersList);
