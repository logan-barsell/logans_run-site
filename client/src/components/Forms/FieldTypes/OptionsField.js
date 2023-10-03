import React from 'react';
import { Field } from 'react-final-form';

const OptionsField = ({ label, name, options, initialValue }) => {
    const val = initialValue ? initialValue : '';
    return (
        <div className="form-group">
            <Field name={name} initialValue={val}>
                {({ input, meta }) => (
                    <>
                        <label htmlFor={name}>
                            {label}
                        </label>
                        <select 
                            className="form-select form-control"
                            name={name}
                            {...input}
                            required={!initialValue}
                            aria-label="Category Select"
                        >
                            <option disabled>Select a Category</option>
                            {options.map((option, index) => (
                                <option defaultValue key={index} value={option.value}>{option.name}</option>
                            ))}
                        </select>
                    </>
                )}
            </Field>
        </div>
    );
};

export default OptionsField;
