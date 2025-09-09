import React from 'react';
import { Field } from 'react-final-form';

const FontSelectField = ({
  label,
  name,
  optgroups = [],
  required = false,
  placeholder = 'Select a font',
  className = '',
  helperText,
  validate,
  onChange,
  selectProps = {},
}) => {
  const isRequired = required === true;

  return (
    <div className={`form-group ${className}`}>
      <Field
        name={name}
        validate={value => {
          // Handle required validation
          if (isRequired && (!value || value === '')) {
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
            <select
              {...input}
              className={`form-select ${
                meta.error && meta.touched ? 'is-invalid' : ''
              }`}
              id={name}
              required={isRequired}
              aria-label={`${label} Select`}
              onChange={e => {
                input.onChange(e);
                if (onChange) {
                  onChange(e);
                }
              }}
              style={{
                backgroundColor: 'var(--form-bg)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                ...selectProps?.style,
              }}
              {...selectProps}
            >
              <option
                disabled
                value=''
                style={{
                  backgroundColor: 'var(--form-bg)',
                  color: 'var(--secondary)',
                }}
              >
                {placeholder}
              </option>
              {optgroups.map((group, groupIndex) => (
                <optgroup
                  key={group.group || groupIndex}
                  label={group.group}
                  style={{
                    backgroundColor: 'var(--form-bg)',
                    color: 'white',
                  }}
                >
                  {group.options.map((option, optionIndex) => (
                    <option
                      key={option.value || `${groupIndex}-${optionIndex}`}
                      value={option.value}
                      style={{
                        backgroundColor: 'var(--form-bg)',
                        color: 'white',
                      }}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Helper Text */}
            {helperText && (
              <div className='form-text text-muted mt-1'>{helperText}</div>
            )}

            {/* Error Message */}
            {meta.error && meta.touched && (
              <div
                className='invalid-feedback d-block'
                style={{
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.875rem',
                  color: '#dc3545',
                }}
              >
                {meta.error}
              </div>
            )}
          </>
        )}
      </Field>
    </div>
  );
};

export default FontSelectField;
