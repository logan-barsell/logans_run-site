import React from 'react';
import { Field } from 'react-final-form';

const required = value => (value ? undefined : 'Required');

const TextField = ({ label, name, initialValue }) => {
  const isRequired = name !== 'tixlink' && !initialValue;

  const validation = () => {
    if (isRequired) {
      return required;
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
