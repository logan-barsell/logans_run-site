import React, { useState, useEffect } from 'react';
import {
  getNewsletterSubscribers,
  getNewsletterStats,
} from '../../services/newsletterService';
import { useAlert } from '../../contexts/AlertContext';
import { format } from 'date-fns';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState('');
  const { showError } = useAlert();

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
        setCurrentPage(page);
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

  const handleGoToPage = e => {
    e.preventDefault();
    const page = parseInt(goToPage);
    if (page && page >= 1 && page <= pagination.totalPages) {
      fetchSubscribers(page);
      setGoToPage('');
    }
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

      {/* Bootstrap Table */}
      <div
        className='card'
        style={{
          backgroundColor: 'var(--accordion-content-bg)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          className='card-header'
          style={{
            backgroundColor: 'var(--accordion-bg)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h5
            className='mb-0'
            style={{ fontFamily: 'var(--secondary-font)', color: 'white' }}
          >
            <i className='fas fa-envelope me-2'></i>
            Newsletter Subscribers ({pagination.totalSubscribers})
          </h5>
        </div>
        <div className='card-body p-0'>
          {subscribers.length === 0 ? (
            <div className='text-center py-4'>
              <i className='fas fa-inbox fa-3x text-muted mb-3'></i>
              <p
                className='text-muted mb-0'
                style={{ fontFamily: 'var(--secondary-font)' }}
              >
                No subscribers found
              </p>
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover mb-0'>
                <thead>
                  <tr>
                    <th scope='col'>Email</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Subscribed</th>
                    <th scope='col'>Last Email</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={subscriber._id}>
                      <td>
                        <div className='d-flex align-items-center'>
                          <i className='fas fa-envelope text-muted me-2'></i>
                          <span style={{ fontFamily: 'var(--secondary-font)' }}>
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td>{getStatusBadge(subscriber.isActive)}</td>
                      <td>
                        <small
                          style={{
                            fontFamily: 'var(--secondary-font)',
                            color: 'white',
                          }}
                        >
                          {formatDate(subscriber.subscribedAt)}
                        </small>
                      </td>
                      <td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className='d-flex flex-column align-items-center mt-3 gap-3'>
          <div className='pagination-wrapper'>
            <ul className='pagination pagination-sm mb-0'>
              <li
                className={`page-item ${
                  !pagination.hasPrevPage ? 'disabled' : ''
                }`}
              >
                <button
                  className='page-link'
                  onClick={() => fetchSubscribers(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{
                    backgroundColor: 'var(--accordion-content-bg)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    minWidth: 'clamp(28px, 6vw, 40px)',
                    height: 'clamp(30px, 8vw, 40px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                    lineHeight: '1',
                  }}
                >
                  ←
                </button>
              </li>

              {/* Page numbers with ellipsis */}
              {(() => {
                const totalPages = pagination.totalPages;
                const current = currentPage;
                const pages = [];

                // For mobile screens, show fewer page numbers
                const isMobile = window.innerWidth <= 768;
                const maxVisiblePages = isMobile ? 3 : 5;

                if (totalPages <= maxVisiblePages) {
                  // Show all pages if within limit
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);

                  if (current <= 3) {
                    // Near the beginning
                    for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
                      pages.push(i);
                    }
                    if (totalPages > 4) {
                      pages.push('...');
                    }
                    pages.push(totalPages);
                  } else if (current >= totalPages - 2) {
                    // Near the end
                    if (totalPages > 4) {
                      pages.push('...');
                    }
                    for (
                      let i = Math.max(2, totalPages - 2);
                      i <= totalPages;
                      i++
                    ) {
                      pages.push(i);
                    }
                  } else {
                    // In the middle
                    pages.push('...');
                    for (let i = current - 1; i <= current + 1; i++) {
                      pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                  }
                }

                return pages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <li
                        key={`ellipsis-${index}`}
                        className='page-item disabled'
                      >
                        <span
                          className='page-link'
                          style={{
                            backgroundColor: 'var(--accordion-content-bg)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: 'var(--secondary-font)',
                            minWidth: 'clamp(26px, 6vw, 35px)',
                            height: 'clamp(30px, 8vw, 40px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'default',
                            fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
                          }}
                        >
                          ...
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={page}
                      className={`page-item ${
                        current === page ? 'active' : ''
                      }`}
                    >
                      <button
                        className='page-link'
                        onClick={() => fetchSubscribers(page)}
                        style={{
                          backgroundColor:
                            current === page
                              ? 'var(--primary-color)'
                              : 'var(--accordion-content-bg)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontFamily: 'var(--secondary-font)',
                          minWidth: 'clamp(26px, 6vw, 35px)',
                          height: 'clamp(30px, 8vw, 40px)',
                          fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  );
                });
              })()}

              <li
                className={`page-item ${
                  !pagination.hasNextPage ? 'disabled' : ''
                }`}
              >
                <button
                  className='page-link'
                  onClick={() => fetchSubscribers(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{
                    backgroundColor: 'var(--accordion-content-bg)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    minWidth: 'clamp(28px, 6vw, 40px)',
                    height: 'clamp(30px, 8vw, 40px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
                    lineHeight: '1',
                  }}
                >
                  →
                </button>
              </li>
            </ul>
          </div>
          <div
            className='text-white text-center'
            style={{
              fontFamily: 'var(--secondary-font)',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            }}
          >
            Showing {(currentPage - 1) * 20 + 1} to{' '}
            {Math.min(currentPage * 20, pagination.totalSubscribers)} of{' '}
            {pagination.totalSubscribers} subscribers
          </div>

          {/* Go to page input for large datasets */}
          {pagination.totalPages > 10 && (
            <div className='d-flex align-items-center gap-2 mt-2'>
              <span
                className='text-white'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                }}
              >
                Go to page:
              </span>
              <form
                onSubmit={handleGoToPage}
                className='d-flex gap-2'
              >
                <input
                  type='number'
                  min='1'
                  max={pagination.totalPages}
                  value={goToPage}
                  onChange={e => setGoToPage(e.target.value)}
                  className='form-control form-control-sm'
                  style={{
                    width: '60px',
                    backgroundColor: 'var(--accordion-content-bg)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  }}
                  placeholder='#'
                />
                <button
                  type='submit'
                  className='btn btn-sm'
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderColor: 'var(--primary-color)',
                    color: 'white',
                    fontFamily: 'var(--secondary-font)',
                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  }}
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscribersList;
