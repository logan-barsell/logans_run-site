import React from 'react';
import { Field } from 'react-final-form';

// const required = value => (value ? undefined : 'Required');

const PriceFields = ({ label, name, placeholder, initialValues }) => {
  const doorval = initialValues ? initialValues.doorprice : '';
  const advval = initialValues ? initialValues.advprice : '';

  return (
    <div className='form-group'>
      <label htmlFor={name.doorprice}>{label}</label>
      <div className='input-group mb-3'>
        <Field
          name={name.doorprice}
          placeholder={placeholder.doorprice}
          // validate={required}
          initialValue={doorval}
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
        <Field
          name={name.advprice}
          placeholder={placeholder.advprice}
          // validate={required}
          initialValue={advval}
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
              />
            </>
          )}
        </Field>
      </div>
    </div>
  );
};

export default PriceFields;
