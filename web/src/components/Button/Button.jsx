import React from 'react';
import './Button.css';

/**
 * Flexible, reusable Button component
 *
 * Props:
 * - as: HTML element or React component to render as (default: 'button')
 * - variant: 'danger' | 'dark' | 'secondary' | 'primary' | etc. (default: 'danger')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - icon: React node (optional)
 * - iconPosition: 'left' | 'right' | 'center' (default: 'left')
 * - fullWidth: boolean (default: false)
 * - loading: boolean (default: false)
 * - disabled: boolean (default: false)
 * - className: string (additional classes)
 * - type: 'button' | 'submit' | 'reset' (default: 'button')
 * - children: button label/content
 * - ...rest: other button props
 */
const Button = ({
  as: Component = 'button',
  variant = 'danger',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const btnClass = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    fullWidth ? 'btn-block' : '',
    loading ? 'btn-loading' : '',
    iconPosition === 'center' ? 'btn-square' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Don't pass type prop to non-button elements
  const elementProps = Component === 'button' ? { type } : {};

  return (
    <Component
      className={btnClass}
      disabled={disabled || loading}
      {...elementProps}
      {...rest}
    >
      {loading && (
        <span
          className='spinner-border spinner-border-sm me-2'
          role='status'
          aria-hidden='true'
        ></span>
      )}
      {icon && iconPosition === 'left' && (
        <span className='btn-icon me-2'>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'center' && (
        <span className='btn-icon'>{icon}</span>
      )}
      {icon && iconPosition === 'right' && (
        <span className='btn-icon ms-2'>{icon}</span>
      )}
    </Component>
  );
};

export default Button;
