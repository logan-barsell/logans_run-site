import React, { useState } from 'react';
import { Field } from 'react-final-form';
import {
  validatePasswordStrength,
  getPasswordStrengthLabel,
  calculatePasswordStrength,
} from '../../../utils/validation/passwordValidation';

const PasswordField = ({
  label,
  name,
  required,
  placeholder,
  helperText,
  validate,
  showStrengthIndicator = false,
  onStrengthChange,
  showRequirements = false,
  className = '',
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (input, e) => {
    const newValue = e.target.value;
    input.onChange(newValue);

    // Handle password strength if enabled
    if (showStrengthIndicator && onStrengthChange && newValue) {
      const strength = calculatePasswordStrength(newValue);
      onStrengthChange(strength);
    }

    if (!isDirty && newValue) {
      setIsDirty(true);
    }
  };

  // Reuse shared validation utilities from utils/passwordValidation

  return (
    <Field
      name={name}
      validate={validate}
    >
      {({ input, meta }) => {
        const currentValue = input.value || '';
        const hasValue = currentValue.length > 0;
        const strength =
          hasValue && showStrengthIndicator
            ? validatePasswordStrength(currentValue)
            : null;

        return (
          <div className={`form-group ${className}`}>
            {/* Label with strength indicator */}
            <div className='d-flex justify-content-between align-items-center mb-1'>
              <label
                htmlFor={name}
                className='form-label mb-0'
                style={{ color: 'var(--main)' }}
              >
                {label}
              </label>
              {hasValue && strength && (
                <small
                  className={'d-none d-sm-inline'}
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: '0.75rem',
                    color: getPasswordStrengthLabel(strength.score).color,
                  }}
                >
                  {getPasswordStrengthLabel(strength.score).label}
                </small>
              )}
            </div>

            {/* Password input */}
            <input
              {...input}
              className='form-control'
              id={name}
              type='password'
              placeholder={placeholder}
              required={required}
              autoComplete='off'
              onChange={e => handleChange(input, e)}
              style={{
                backgroundColor: 'var(--form-bg)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            />

            {/* Strength indicator for mobile */}
            {hasValue && strength && (
              <small
                className={'d-sm-none mt-1'}
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.7rem',
                  color: getPasswordStrengthLabel(strength.score).color,
                }}
              >
                {getPasswordStrengthLabel(strength.score).label}
              </small>
            )}

            {/* Requirements text */}
            {showRequirements && (
              <div
                className='form-text mt-1'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.75rem',
                  color: 'white',
                }}
              >
                Password must be at least 8 characters with uppercase,
                lowercase, number, and special character
              </div>
            )}

            {/* Custom helper text */}
            {helperText && (
              <div
                className='form-text'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.875rem',
                  color: 'white',
                }}
              >
                {helperText}
              </div>
            )}

            {/* Suppress default field error rendering; use helperText in parent instead */}
          </div>
        );
      }}
    </Field>
  );
};

export default PasswordField;
