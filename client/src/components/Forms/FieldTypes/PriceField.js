import React from 'react';
import { Field } from 'react-final-form';

// const required = value => (value ? undefined : 'Required');

const PriceField = ({ label, name, placeholder, initialValue }) => {
  const val = initialValue ? initialValue : '';

  return (
    <div className='form-group'>
      <label htmlFor={name}>{label}</label>
      <div className='input-group mb-3'>
        <Field
          name={name}
          placeholder={placeholder}
          // validate={required}
          initialValue={val}
        >
          {({ input, meta, name, placeholder }) => (
            <>
              <span
                className='input-group-text'
                id='basic-addon1'
              >
                $
              </span>
              <input
                className={`form-control${
                  meta.error && meta.touched ? ' error' : ''
                }`}
                id={name}
                type='text'
                name={name}
                placeholder={placeholder}
                {...input}
                // required
                autoComplete='off'
              />
            </>
          )}
        </Field>
      </div>
    </div>
  );
};

export default PriceField;
