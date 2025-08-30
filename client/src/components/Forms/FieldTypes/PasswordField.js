import React, { useState } from 'react';

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  helperText,
  showStrengthIndicator = false,
  onStrengthChange,
  className = '',
}) => {
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = e => {
    const newValue = e.target.value;
    onChange(e);

    // Handle password strength if enabled
    if (showStrengthIndicator && onStrengthChange && newValue) {
      const strength = calculatePasswordStrength(newValue);
      onStrengthChange(strength);
    }

    if (!isDirty && newValue) {
      setIsDirty(true);
    }
  };

  const calculatePasswordStrength = password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = {
      score: 0,
      feedback: [],
      isValid: false,
    };

    if (password.length >= minLength) {
      strength.score += 1;
    } else {
      strength.feedback.push(`At least ${minLength} characters`);
    }

    if (hasUpperCase) {
      strength.score += 1;
    } else {
      strength.feedback.push('One uppercase letter');
    }

    if (hasLowerCase) {
      strength.score += 1;
    } else {
      strength.feedback.push('One lowercase letter');
    }

    if (hasNumbers) {
      strength.score += 1;
    } else {
      strength.feedback.push('One number');
    }

    if (hasSpecialChar) {
      strength.score += 1;
    } else {
      strength.feedback.push('One special character');
    }

    strength.isValid = strength.score >= 4 && password.length >= minLength;

    return strength;
  };

  const getPasswordStrengthLabel = score => {
    if (score < 2) return { label: 'Weak', color: '#dc3545' };
    if (score < 4) return { label: 'Fair', color: '#ffc107' };
    if (score < 5) return { label: 'Good', color: '#17a2b8' };
    return { label: 'Strong', color: '#28a745' };
  };

  return (
    <div className={`form-group ${className}`}>
      <label
        htmlFor={name}
        className='form-label'
        style={{ color: 'var(--main)' }}
      >
        {label}
      </label>
      <input
        className='form-control'
        id={name}
        type='password'
        name={name}
        value={value || ''}
        placeholder={placeholder}
        required={required}
        autoComplete='off'
        onChange={handleChange}
        style={{
          backgroundColor: 'var(--form-bg)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      />

      {/* Helper text */}
      {helperText && (
        <div
          className='form-text'
          style={{
            fontFamily: 'var(--secondary-font)',
            fontSize: '0.875rem',
            color: 'white',
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default PasswordField;
