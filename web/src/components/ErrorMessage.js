import React from 'react';

const ErrorMessage = ({ children, className }) => (
  <div className={`red text-center secondary-font mb-2 ${className} `}>
    {children}
  </div>
);

export default ErrorMessage;
