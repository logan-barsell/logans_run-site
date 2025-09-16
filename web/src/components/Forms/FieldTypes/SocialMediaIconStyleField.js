import React from 'react';
import { Field } from 'react-final-form';
import { SocialIconPreview } from '../../SocialIcons';

const SocialMediaIconStyleField = ({
  label,
  name,
  options = [],
  initialValue,
  required = false,
  placeholder = 'Select an option',
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
              {options.map((option, index) => (
                <option
                  key={option.value || index}
                  value={option.value}
                  style={{
                    backgroundColor: 'var(--form-bg)',
                    color: 'white',
                  }}
                >
                  {option.name || option.label}
                </option>
              ))}
            </select>

            {/* Social Media Icon Preview */}
            <div className='mt-2'>
              <SocialIconPreview
                style={input.value || initialValue || 'default'}
              />
            </div>

            {/* Helper Text */}
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

            {/* Error Message */}
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
          </>
        )}
      </Field>
    </div>
  );
};

export default SocialMediaIconStyleField;
