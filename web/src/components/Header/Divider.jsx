import React from 'react';

/**
 * Divider - Consistent <hr> styling
 *
 * Props:
 * - width: string (e.g. '75%', '100px', default '100%')
 * - color: string (CSS color, default 'black')
 * - variant: string ('white' for white divider)
 * - className: string (additional classes)
 * - style: object (inline styles)
 */
const Divider = ({
  width = '100%',
  variant = 'black',
  className = '',
  style = {},
  ...rest
}) => {
  const dividerColor = variant === 'black' ? 'black' : 'white';

  return (
    <hr
      className={className}
      style={{
        height: '1px',
        width,
        backgroundColor: dividerColor,
        borderTop: dividerColor,
        ...style,
      }}
      {...rest}
    />
  );
};

export default Divider;
