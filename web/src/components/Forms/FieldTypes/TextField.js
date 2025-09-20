import React, { useState, useEffect, useCallback } from 'react';
import { Field } from 'react-final-form';

const TextField = ({
  label,
  name,
  required,
  placeholder,
  helperText,
  displayHelperText,
  validate,
  validationState,
  onValidationChange,
  inputGroupPrefix,
  inputGroupSuffix,
  className = '',
}) => {
  const [localValidationState, setLocalValidationState] = useState({
    isValid: true,
    error: null,
    isDirty: false,
  });

  // Use provided validation state or local state
  const currentValidationState = validationState || localValidationState;

  // Only require if explicitly set to true
  const isRequired = required === true;

  const handleValidation = useCallback(
    value => {
      // Handle required validation
      if (isRequired && !value) {
        return 'Required';
      }

      // Handle custom validation
      if (validate && value) {
        const validation = validate(value);
        if (validation) {
          return validation;
        }
      }

      return undefined;
    },
    [isRequired, validate]
  );

  // Run validation immediately for required fields
  useEffect(() => {
    if (isRequired) {
      const validation = handleValidation('');
      const newValidationState = {
        isValid: !validation,
        error: validation,
        isDirty: false,
      };
      setLocalValidationState(newValidationState);
    }
  }, [isRequired, handleValidation]);

  const handleChange = (input, value) => {
    input.onChange(value);

    // Always run validation for required fields, even when empty
    if (isRequired || validate) {
      const validation = handleValidation(value);
      const newValidationState = {
        isValid: !validation,
        error: validation,
        isDirty: true,
      };

      setLocalValidationState(newValidationState);
      if (onValidationChange) {
        onValidationChange(newValidationState);
      }
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <Field
        name={name}
        validate={handleValidation}
      >
        {({ input, meta }) => (
          <>
            <label
              htmlFor={name}
              className='form-label'
              style={{ color: 'var(--main)' }}
            >
              {label}
            </label>
            <div className='input-group'>
              {inputGroupPrefix && (
                <span className='input-group-text'>{inputGroupPrefix}</span>
              )}
              <input
                className={`form-control ${
                  currentValidationState.isDirty &&
                  !currentValidationState.isValid &&
                  input.value
                    ? 'is-invalid'
                    : currentValidationState.isDirty &&
                      currentValidationState.isValid &&
                      input.value
                    ? 'is-valid'
                    : meta.error && meta.touched
                    ? 'is-invalid'
                    : ''
                }`}
                id={name}
                type='text'
                name={name}
                placeholder={placeholder}
                {...input}
                required={isRequired}
                autoComplete='off'
                onChange={e => handleChange(input, e.target.value)}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
              />
              {inputGroupSuffix && (
                <span className='input-group-text'>{inputGroupSuffix}</span>
              )}
            </div>

            {/* Custom validation feedback */}
            {currentValidationState.isDirty &&
              !currentValidationState.isValid &&
              input.value && (
                <div
                  className='invalid-feedback'
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: '0.875rem',
                  }}
                >
                  {currentValidationState.error}
                </div>
              )}
            {currentValidationState.isDirty &&
              currentValidationState.isValid &&
              input.value && <div className='valid-feedback'>Valid ✓</div>}

            {/* Form validation feedback */}
            {meta.touched && meta.error && !currentValidationState.isDirty && (
              <div
                className='invalid-feedback d-block'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.875rem',
                }}
              >
                {meta.error}
              </div>
            )}

            {/* Helper text */}
            {helperText &&
              currentValidationState.isDirty &&
              !currentValidationState.isValid &&
              input.value && (
                <div
                  className='form-text'
                  style={{
                    fontFamily: 'var(--secondary-font)',
                    fontSize: '0.875rem',
                    color: 'var(--secondary',
                  }}
                >
                  {helperText}
                </div>
              )}
            {helperText && displayHelperText && (
              <div
                className='form-text'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.875rem',
                }}
              >
                {helperText}
              </div>
            )}
          </>
        )}
      </Field>
    </div>
  );
};

export default TextField;
