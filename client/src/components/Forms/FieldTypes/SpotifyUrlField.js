import React, { useState, useEffect } from 'react';
import { Field } from 'react-final-form';
import { validateSpotifyUrl } from '../../../utils/spotifyValidation';

const SpotifyUrlField = ({ label, name, placeholder, initialValue }) => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    error: null,
    isDirty: false,
  });

  const validateField = value => {
    if (!value || !validationState.isDirty) {
      return undefined;
    }

    const validation = validateSpotifyUrl(value);
    setValidationState({
      isValid: validation.isValid,
      error: validation.error,
      isDirty: true,
    });

    return validation.isValid ? undefined : validation.error;
  };

  const handleChange = (input, value) => {
    input.onChange(value);
    setValidationState(prev => ({ ...prev, isDirty: true }));
  };

  return (
    <Field
      name={name}
      validate={validateField}
      initialValue={initialValue}
    >
      {({ input, meta }) => (
        <div className='mb-3'>
          <label
            htmlFor={name}
            className='form-label'
          >
            {label}
          </label>
          <input
            {...input}
            id={name}
            type='text'
            className={`form-control ${
              validationState.isDirty && !validationState.isValid
                ? 'is-invalid'
                : validationState.isDirty && validationState.isValid
                ? 'is-valid'
                : ''
            }`}
            placeholder={
              placeholder || 'Enter Spotify URL (track, album, or playlist)'
            }
            onChange={e => handleChange(input, e.target.value)}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
          />
          {validationState.isDirty && !validationState.isValid && (
            <div className='invalid-feedback'>{validationState.error}</div>
          )}
          {validationState.isDirty && validationState.isValid && (
            <div className='valid-feedback'>Valid Spotify URL ✓</div>
          )}
          {meta.touched && meta.error && (
            <div className='invalid-feedback d-block'>{meta.error}</div>
          )}
          <div className='form-text'>
            Supported formats: Track, Album, or Playlist URLs from Spotify
          </div>
        </div>
      )}
    </Field>
  );
};

export default SpotifyUrlField;
