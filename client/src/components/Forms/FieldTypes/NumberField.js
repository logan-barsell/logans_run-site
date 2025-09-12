import React from 'react';
import { Field } from 'react-final-form';

const NumberField = ({
  label,
  name,
  initialValue,
  placeholder,
  required,
  min = 0,
}) => {
  const isRequired = required === true;
  const validation = () => {
    return value => {
      // Handle required validation
      if (isRequired && (value === undefined || value === '')) {
        return 'Required';
      }

      // Handle non-negative validation
      if (value !== undefined && value !== '' && value < min) {
        return `Value must be ${min} or higher`;
      }

      return undefined;
    };
  };
  const val = initialValue !== undefined ? initialValue : '';

  return (
    <div className='form-group mb-3'>
      <Field
        name={name}
        validate={validation()}
        initialValue={val}
        type='number'
        parse={value => (value === '' ? undefined : Number(value))}
      >
        {({ input, meta }) => (
          <>
            {label && <label htmlFor={name}>{label}</label>}
            <input
              type='number'
              className={`form-control ${
                meta.error && meta.touched ? 'is-invalid' : ''
              }`}
              id={name}
              name={name}
              placeholder={placeholder}
              min={min}
              {...input}
              required={isRequired}
            />
            {meta.error && meta.touched && (
              <div className='invalid-feedback secondary-font'>
                {meta.error}
              </div>
            )}
          </>
        )}
      </Field>
    </div>
  );
};

export default NumberField;
