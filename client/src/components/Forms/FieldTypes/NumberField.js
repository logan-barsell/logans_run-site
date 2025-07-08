import React from 'react';
import { Field } from 'react-final-form';

const NumberField = ({ label, name, initialValue, placeholder, required }) => {
  const isRequired = required === true;
  const validation = () => {
    if (isRequired) {
      return value =>
        value !== undefined && value !== '' ? undefined : 'Required';
    }
    return undefined;
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
              className='form-control'
              id={name}
              name={name}
              placeholder={placeholder}
              {...input}
              required={isRequired}
            />
          </>
        )}
      </Field>
    </div>
  );
};

export default NumberField;
