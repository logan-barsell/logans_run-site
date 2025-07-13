import React from 'react';
import './CustomForm.css';

const CustomForm = ({
  title,
  children,
  className = '',
  containerId = null,
  showTitle = true,
}) => {
  const containerClass = `custom-form-container ${className}`.trim();
  const containerProps = containerId ? { id: containerId } : {};

  return (
    <div
      className={containerClass}
      {...containerProps}
    >
      {showTitle && title && <h3 className='custom-form-title'>{title}</h3>}
      {children}
    </div>
  );
};

export default CustomForm;
