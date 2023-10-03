import 'react-datepicker/dist/react-datepicker.css';
import './dateField.css';

import React from 'react';
import { Field } from 'react-final-form';
import DatePicker from 'react-datepicker';

const required = value => (value ? undefined : 'Required');

const DateField = ({ label, name, initialValue }) => {
  const val = initialValue ? initialValue : '';

  return (
    <div className="form-group">
      <Field
        name={name}
        validate={required}
        initialValue={new Date(val).getTime()}
      >
        {({ name, meta, input: { value, onChange, onBlur } }) => (
          <>
            <label htmlFor={name}>
              {label}
            </label>
            <DatePicker
              className={meta.error && meta.touched ? ' error' : ''}
              name={name}
              selected={value}
              onChange={date => onChange(date)}
              onBlur={onBlur}
              onFocus={(e) => e.target.readOnly = true}
              required
            />
          </>
        )}
      </Field>

    </div>
  );
};

export default DateField;