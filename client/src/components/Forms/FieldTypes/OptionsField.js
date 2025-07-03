import React from 'react';
import { Field } from 'react-final-form';

const OptionsField = ({
  label,
  name,
  options,
  initialValue,
  placeholder = 'Select an option',
  required = false,
  selectProps = {},
  wrapperClass = 'form-group',
}) => {
  const val = initialValue ? initialValue : '';
  return (
    <div className={wrapperClass}>
      <Field
        name={name}
        initialValue={val}
      >
        {({ input, meta }) => (
          <>
            <label
              htmlFor={name}
              className='form-label'
            >
              {label}
            </label>
            <select
              className='form-select form-control'
              name={name}
              {...input}
              required={required}
              aria-label={label + ' Select'}
              {...selectProps}
            >
              <option
                disabled
                value=''
              >
                {placeholder}
              </option>
              {options.map((option, index) => (
                <option
                  key={index}
                  value={option.value}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </>
        )}
      </Field>
    </div>
  );
};

export default OptionsField;
