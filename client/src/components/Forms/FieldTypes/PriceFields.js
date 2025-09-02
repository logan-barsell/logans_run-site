import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

// const required = value => (value ? undefined : 'Required');

const PriceFields = ({ label, name, placeholder, initialValues }) => {
  const memoizedInitialValues = useMemo(() => {
    return {
      doorprice: initialValues ? initialValues.doorprice : '',
      advprice: initialValues ? initialValues.advprice : '',
    };
  }, [initialValues]);

  return (
    <div className='form-group'>
      <label htmlFor={name.doorprice}>{label}</label>
      <div className='input-group mb-3'>
        <Field
          name={name.doorprice}
          placeholder={placeholder.doorprice}
          // validate={required}
          initialValue={memoizedInitialValues.doorprice}
        >
          {({ input, meta, name: fieldName, placeholder }) => (
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
                id={fieldName}
                type='text'
                name={fieldName}
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
          initialValue={memoizedInitialValues.advprice}
        >
          {({ input, meta, name: fieldName, placeholder }) => (
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
                id={fieldName}
                type='text'
                name={fieldName}
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
