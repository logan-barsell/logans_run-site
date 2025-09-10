import React, { useState } from 'react';
import './DataTable.css';
import LoadingSpinner from '../LoadingSpinner';

const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  error = null,
  emptyMessage = 'No data found',
  emptyIcon = 'fas fa-inbox',
  pagination = null,
  onPageChange = null,
  className = '',
  headerActions = null,
  rowActions = null,
  getRowKey = (item, index) => item.id || index,
}) => {
  const [goToPage, setGoToPage] = useState('');

  const handleGoToPage = e => {
    e.preventDefault();
    const page = parseInt(goToPage);
    if (page && page >= 1 && page <= pagination.totalPages) {
      onPageChange && onPageChange(page);
      setGoToPage('');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        size='lg'
        color='white'
        text='Loading data...'
        centered={true}
      />
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
    <div className={`data-table-wrapper ${className}`}>
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
          <div className='d-flex justify-content-between align-items-center'>
            <h5
              className='mb-0'
              style={{ fontFamily: 'var(--secondary-font)', color: 'white' }}
            >
              {title}
            </h5>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
        <div className='card-body p-0'>
          {data.length === 0 ? (
            <div className='text-center py-4'>
              <i className={`${emptyIcon} fa-3x text-muted mb-3`}></i>
              <p
                className='text-muted mb-0'
                style={{ fontFamily: 'var(--secondary-font)' }}
              >
                {emptyMessage}
              </p>
            </div>
          ) : (
            <div className='table-responsive'>
              <table className='table table-hover mb-0'>
                <thead>
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope='col'
                      >
                        {column.header}
                      </th>
                    ))}
                    {rowActions && <th scope='col'>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={getRowKey(item, index)}>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column.render
                            ? column.render(item, index)
                            : item[column.key]}
                        </td>
                      ))}
                      {rowActions && <td>{rowActions(item, index)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
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
                  onClick={() =>
                    onPageChange && onPageChange(pagination.currentPage - 1)
                  }
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
                const current = pagination.currentPage;
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
                        onClick={() => onPageChange && onPageChange(page)}
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
                  onClick={() =>
                    onPageChange && onPageChange(pagination.currentPage + 1)
                  }
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
            {(pagination.totalItems || pagination.totalSubscribers) && (
              <>
                Showing{' '}
                {(pagination.currentPage - 1) *
                  (pagination.itemsPerPage || 20) +
                  1}{' '}
                to{' '}
                {Math.min(
                  pagination.currentPage * (pagination.itemsPerPage || 20),
                  pagination.totalItems || pagination.totalSubscribers
                )}{' '}
                of {pagination.totalItems || pagination.totalSubscribers} items
              </>
            )}
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

export default DataTable;
