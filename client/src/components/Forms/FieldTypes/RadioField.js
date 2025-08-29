import React from 'react';
import './radioField.css';

const RadioField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  helperText,
  className = '',
  inline = false,
  toggle = false, // New prop for toggle behavior
  enabledText = '', // Text to show when enabled
  disabledText = '', // Text to show when disabled
  disabled = false, // Whether the field is disabled
}) => {
  const handleChange = optionValue => {
    // Create a synthetic event object that matches what handleInputChange expects
    const syntheticEvent = {
      target: {
        name: name,
        value: String(optionValue), // Convert to string for consistency
      },
    };
    onChange(syntheticEvent);
  };

  // For toggle behavior, we use a checkbox-like approach with radio styling
  if (toggle) {
    const isEnabled = value === true;
    return (
      <div className={`form-group ${className}`}>
        {label && (
          <label
            className='form-label'
            style={{ color: 'var(--main)' }}
          >
            {label}
          </label>
        )}

        <div className='d-flex align-items-start'>
          <div className='form-check'>
            <input
              className='form-check-input'
              type='checkbox'
              id={`${name}-toggle`}
              name={name}
              checked={isEnabled}
              onChange={() => handleChange(!isEnabled)}
              disabled={disabled}
            />
            <label
              className='form-check-label'
              htmlFor={`${name}-toggle`}
              style={{
                color: 'white',
                fontFamily: 'var(--secondary-font)',
                marginLeft: '0.5rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {isEnabled ? enabledText : disabledText}
            </label>
          </div>
        </div>

        {helperText && <div className='form-text'>{helperText}</div>}
      </div>
    );
  }

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label
          className='form-label'
          style={{ color: 'var(--main)' }}
        >
          {label}
        </label>
      )}

      <div
        className={`${
          inline ? 'd-flex flex-wrap gap-3' : 'd-flex flex-column gap-2'
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={`form-check ${inline ? 'me-4' : ''}`}
            style={{ marginBottom: inline ? '0' : '0.5rem' }}
          >
            <input
              className='form-check-input'
              type='radio'
              id={`${name}-${index}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled}
            />
            <label
              className='form-check-label'
              htmlFor={`${name}-${index}`}
              style={{
                color: 'white',
                fontFamily: 'var(--secondary-font)',
                marginLeft: '0.5rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {option.label}
              {option.description && (
                <div className='radio-description'>{option.description}</div>
              )}
            </label>
          </div>
        ))}
      </div>

      {helperText && <div className='form-text'>{helperText}</div>}
    </div>
  );
};

export default RadioField;
