import React from 'react';
import './ResponsiveImageDisplay.css';

const ResponsiveImageDisplay = ({
  src,
  alt,
  className = '',
  maxHeight = '200px',
  placeholder = 'No Image Uploaded',
}) => {
  if (!src) {
    return (
      <div className={`responsive-image-container ${className}`}>
        <div
          className='d-flex align-items-center justify-content-center border border-dark secondary-font rounded text-muted'
          style={{ minHeight: '120px', background: 'var(--form-bg)' }}
        >
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className={`responsive-image-container ${className}`}>
      <img
        src={src}
        alt={alt}
        className='responsive-image'
        style={{
          maxHeight: maxHeight,
        }}
      />
    </div>
  );
};

export default ResponsiveImageDisplay;
