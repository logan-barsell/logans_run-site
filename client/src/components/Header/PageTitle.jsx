import React from 'react';
import Divider from './Divider';

/**
 * PageTitle - Consistent page/section title with optional divider
 *
 * Props:
 * - children: title text
 * - divider: bool (show divider below title)
 * - as: string (h1-h6, default h3)
 * - className: string (additional classes)
 * - style: object (inline styles)
 * - marginClass: string (custom margin class, default 'mt-5')
 * - color: string (text color, default 'var(--main)')
 */
const PageTitle = ({
  children,
  divider = false,
  as = 'h3',
  className = '',
  style = {},
  marginClass = 'mt-5 mb-0',
  color = 'var(--main)',
  ...rest
}) => {
  const Tag = as;
  return (
    <>
      <Tag
        className={`page-title text-center ${marginClass} ${className}`.trim()}
        style={{ color, ...style }}
        {...rest}
      >
        {children}
      </Tag>
      {divider && (
        <Divider
          className='w-75 mx-auto'
          variant='white'
        />
      )}
    </>
  );
};

export default PageTitle;
