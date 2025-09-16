import React from 'react';
import Image from 'next/image';
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
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: maxHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default ResponsiveImageDisplay;
