import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner - A reusable loading spinner component
 *
 * @param {Object} props
 * @param {string} props.size - Size of the spinner: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} props.color - Color variant: 'main', 'secondary', 'white', 'black' (default: 'main')
 * @param {string} props.text - Optional text to display below spinner
 * @param {boolean} props.centered - Whether to center the spinner (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'main',
  text = '',
  centered = true,
  className = '',
  style = {},
}) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    `loading-spinner--${color}`,
    centered ? 'loading-spinner--centered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={spinnerClasses}
      style={style}
    >
      <div className='loading-spinner__spinner'>
        <div className='loading-spinner__ring'></div>
        <div className='loading-spinner__ring'></div>
        <div className='loading-spinner__ring'></div>
        <div className='loading-spinner__ring'></div>
      </div>
      {text && <div className='loading-spinner__text'>{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
