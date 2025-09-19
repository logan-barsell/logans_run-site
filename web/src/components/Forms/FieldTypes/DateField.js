import 'react-datepicker/dist/react-datepicker.css';
import './dateField.css';

import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import DatePicker from 'react-datepicker';

const required = value => (value ? undefined : 'Required');

// Helper function to normalize dates to start of day in local timezone
const normalizeDate = date => {
  if (!date) return null;

  let normalizedDate;
  if (date instanceof Date) {
    normalizedDate = new Date(date);
  } else {
    normalizedDate = new Date(date);
  }

  // Check if valid date
  if (isNaN(normalizedDate.getTime())) {
    return null;
  }

  // Normalize to start of day in local timezone to avoid timezone issues
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

// Helper function to compare dates for equality
const areDatesEqual = (date1, date2) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;

  const normalized1 = normalizeDate(date1);
  const normalized2 = normalizeDate(date2);

  if (!normalized1 && !normalized2) return true;
  if (!normalized1 || !normalized2) return false;

  return normalized1.getTime() === normalized2.getTime();
};

const DateField = ({ label, name, initialValue }) => {
  const memoizedInitialValue = useMemo(() => {
    return normalizeDate(initialValue);
  }, [initialValue]);

  return (
    <div className='form-group'>
      <Field
        name={name}
        validate={required}
        initialValue={memoizedInitialValue}
        // Add custom comparison for dates
        isEqual={(a, b) => areDatesEqual(a, b)}
      >
        {({ name, meta, input: { value, onChange, onBlur } }) => {
          // Ensure the DatePicker always receives a normalized Date object
          let selectedValue = normalizeDate(value);

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
                onChange={date => {
                  // Normalize the date when user selects it
                  const normalizedDate = normalizeDate(date);
                  onChange(normalizedDate);
                }}
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
