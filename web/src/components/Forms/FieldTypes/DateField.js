import 'react-datepicker/dist/react-datepicker.css';
import './dateField.css';

import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import DatePicker from 'react-datepicker';

const required = value => (value ? undefined : 'Required');

const DateField = ({ label, name, initialValue }) => {
  const memoizedInitialValue = useMemo(() => {
    if (!initialValue) return null;

    // If it's already a Date object, return it directly
    if (initialValue instanceof Date) {
      return initialValue;
    }

    try {
      const date = new Date(initialValue);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (error) {
      return null;
    }
  }, [initialValue]);

  return (
    <div className='form-group'>
      <Field
        name={name}
        validate={required}
        initialValue={memoizedInitialValue}
      >
        {({ name, meta, input: { value, onChange, onBlur } }) => {
          // Ensure the DatePicker always receives a Date object
          let selectedValue = value;
          if (typeof value === 'string' && value) {
            try {
              selectedValue = new Date(value);
              if (isNaN(selectedValue.getTime())) {
                selectedValue = null;
              }
            } catch (error) {
              selectedValue = null;
            }
          }

          return (
            <>
              <label
                className=''
                htmlFor={name}
              >
                {label}
              </label>
              <DatePicker
                id={name}
                className={` ${meta.error && meta.touched ? ' error' : ''}`}
                name={name}
                selected={selectedValue}
                onChange={date => onChange(date)}
                onBlur={onBlur}
                onFocus={e => (e.target.readOnly = true)}
                required
              />
            </>
          );
        }}
      </Field>
    </div>
  );
};

export default DateField;
