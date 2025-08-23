import React from 'react';

/**
 * NoContent - Consistent empty state message
 *
 * Props:
 * - children: message text
 * - className: string (additional classes)
 * - style: object (inline styles)
 */
const NoContent = ({ children, className = '', style = {}, ...rest }) => (
  <div
    className={`no-content-message text-center ${className}`.trim()}
    style={{
      fontFamily: 'var(--secondary-font)',
      color: 'var(--main)',
      marginTop: 22,
      textAlign: 'center',
      fontSize: 22,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export default NoContent;
