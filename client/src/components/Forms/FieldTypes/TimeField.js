import 'react-datepicker/dist/react-datepicker.css';
import './dateField.css';

import React, { useMemo } from 'react';
import { Field } from 'react-final-form';
import DatePicker from 'react-datepicker';

const required = value => (value ? undefined : 'Required');

const TimeField = ({ label, name, placeholder, initialValues }) => {
  const memoizedInitialValues = useMemo(() => {
    const createValidDate = value => {
      if (!value) return null;

      try {
        const date = new Date(value);
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return null;
        }
        return date;
      } catch (error) {
        return null;
      }
    };

    return {
      doors: createValidDate(initialValues?.doors),
      showtime: createValidDate(initialValues?.showtime),
    };
  }, [initialValues]);

  return (
    <div className='form-group'>
      <label htmlFor={name.doors}>{label}</label>
      <div className='input-group mb-3'>
        <Field
          name={name.doors}
          placeholder={placeholder.doors}
          validate={required}
          initialValue={memoizedInitialValues.doors}
        >
          {({
            name: fieldName,
            placeholder,
            meta,
            input: { value, onChange, onBlur },
          }) => {
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
              <DatePicker
                className={meta.error && meta.touched ? ' error' : ''}
                placeholderText={placeholder}
                name={fieldName}
                selected={selectedValue}
                onChange={date => onChange(date)}
                onBlur={onBlur}
                onFocus={e => (e.target.readOnly = true)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                required
              />
            );
          }}
        </Field>
        <Field
          name={name.showtime}
          placeholder={placeholder.showtime}
          validate={required}
          initialValue={memoizedInitialValues.showtime}
        >
          {({
            name: fieldName,
            placeholder,
            meta,
            input: { value, onChange, onBlur },
          }) => {
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
              <DatePicker
                className={meta.error && meta.touched ? ' error' : ''}
                placeholderText={placeholder}
                name={fieldName}
                selected={selectedValue}
                onChange={date => onChange(date)}
                onBlur={onBlur}
                onFocus={e => (e.target.readOnly = true)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption='Time'
                dateFormat='h:mm aa'
                required
              />
            );
          }}
        </Field>
      </div>
    </div>
  );
};

export default TimeField;
