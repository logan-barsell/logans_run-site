import React from 'react';

const StandaloneSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  disabled = false,
  ...selectProps
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className='form-label'
        >
          {label}
          {required && <span className='text-danger ms-1'>*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className='form-select form-control form-select-md mb-3'
        aria-label='.form-select-lg example'
        {...selectProps}
      >
        {placeholder && (
          <option
            value=''
            disabled
          >
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StandaloneSelect;
