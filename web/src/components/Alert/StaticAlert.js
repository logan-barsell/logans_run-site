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
      className='my-5 mx-auto'
      style={{ width: 'fit-content' }}
    >
      <div
        className={`alert alert-${type} mx-3 text-center`}
        role='alert'
      >
        {title && <h5 className='alert-heading mb-2 mx-2'>{title}</h5>}

        {description && <p className='mb-0 mx-2'>{description}</p>}

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
    </div>
  );
};

export default StaticAlert;
