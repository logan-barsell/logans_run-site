import React from 'react';
import { Field } from 'react-final-form';

const TextareaField = ({
  label,
  name,
  initialValue,
  required = false,
  placeholder,
  rows = 3,
  className = '',
  helperText,
  validate,
}) => {
  const isRequired = required === true;

  return (
    <div className={`form-group ${className}`}>
      <Field
        name={name}
        validate={value => {
          // Handle required validation
          if (isRequired && (!value || value.trim() === '')) {
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
        }}
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
            <textarea
              {...input}
              className={`form-control ${
                meta.error && meta.touched ? 'is-invalid' : ''
              }`}
              id={name}
              placeholder={placeholder}
              rows={rows}
              required={isRequired}
              autoComplete='off'
            />
            {meta.error && meta.touched && (
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
            {helperText && (
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

export default TextareaField;
