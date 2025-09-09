import React from 'react';
import './ResponsiveImageDisplay.css';

const ResponsiveImageDisplay = ({
  src,
  alt,
  className = '',
  maxHeight = '200px',
  showBorder = true,
}) => {
  if (!src) return null;

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
