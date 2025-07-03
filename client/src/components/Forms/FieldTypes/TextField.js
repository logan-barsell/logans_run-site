import React from 'react';
import { Field } from 'react-final-form';

const TextField = ({ label, name, initialValue, required }) => {
  // Only require if explicitly set to true
  const isRequired = required === true;

  const validation = () => {
    if (isRequired) {
      return value => (value ? undefined : 'Required');
    }
    return undefined;
  };
  const val = initialValue ? initialValue : '';

  return (
    <div className='form-group'>
      <Field
        name={name}
        validate={validation()}
        initialValue={val}
      >
        {({ input, meta }) => (
          <>
            <label htmlFor={name}>{label}</label>
            <div className='input-group'>
              {name === 'instaTag' && (
                <span
                  className='input-group-text'
                  id='basic-addon1'
                >
                  @
                </span>
              )}
              <input
                className={`form-control${
                  meta.error && meta.touched ? ' error' : ''
                }`}
                id={name}
                type='text'
                name={name}
                {...input}
                required={isRequired}
                autoComplete='off'
              />
            </div>
          </>
        )}
      </Field>
    </div>
  );
};

export default TextField;
