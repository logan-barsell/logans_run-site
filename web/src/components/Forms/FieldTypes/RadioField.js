import React from 'react';
import { Field } from 'react-final-form';
import './radioField.css';

const RadioField = ({
  label,
  name,
  initialValue,
  options = [],
  helperText,
  className = '',
  inline = false,
  toggle = false, // New prop for toggle behavior
  enabledText = '', // Text to show when enabled
  disabledText = '', // Text to show when disabled
  disabled = false, // Whether the field is disabled
  validate,
  onChange, // Custom onChange callback
}) => {
  // Set initialValue - prefer the passed initialValue, but handle cases where it might be undefined
  const fieldProps = {
    name,
    validate,
  };

  // For toggle fields, always try to provide a meaningful initial value
  if (toggle) {
    if (
      initialValue !== undefined &&
      initialValue !== null &&
      initialValue !== ''
    ) {
      fieldProps.initialValue = initialValue;
    } else {
      // For toggle fields, default to false if no initial value is provided
      fieldProps.initialValue = false;
    }
  } else {
    // For non-toggle fields, only set if we have a meaningful value
    if (
      initialValue !== undefined &&
      initialValue !== null &&
      initialValue !== ''
    ) {
      fieldProps.initialValue = initialValue;
    } else {
    }
  }

  return (
    <Field {...fieldProps}>
      {({ input, meta }) => {
        const handleChange = optionValue => {
          // For toggle fields, preserve boolean type to match initial values
          // For other fields, convert to string for consistency
          let valueToSet = optionValue;

          if (toggle) {
            // For toggle fields, ensure boolean type
            valueToSet = Boolean(optionValue);
          } else {
            // For radio fields, convert to string
            valueToSet = String(optionValue);
          }

          input.onChange(valueToSet);
          if (onChange) {
            onChange(optionValue); // Call custom onChange callback
          }
        };

        // For toggle behavior, we use a checkbox-like approach with radio styling
        if (toggle) {
          const isEnabled = Boolean(input.value);
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
                    checked={input.value === option.value}
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
                      <div className='radio-description'>
                        {option.description}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>

            {helperText && <div className='form-text'>{helperText}</div>}
          </div>
        );
      }}
    </Field>
  );
};

export default RadioField;
