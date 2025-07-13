import React from 'react';
import './StaticAlert.css';

const StaticAlert = ({
  type = 'info',
  title,
  description,
  troubleshooting,
}) => {
  return (
    <div
      className={`alert alert-${type}`}
      role='alert'
    >
      {title && <h5 className='alert-heading mb-2'>{title}</h5>}

      {description && <p className='mb-0'>{description}</p>}

      {troubleshooting && troubleshooting.length > 0 && (
        <div className='mt-3'>
          <strong>Troubleshooting steps:</strong>
          <ol className='mb-0 mt-2'>
            {troubleshooting.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default StaticAlert;
