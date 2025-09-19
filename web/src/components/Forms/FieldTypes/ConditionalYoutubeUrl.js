import React, { forwardRef } from 'react';
import { FormSpy } from 'react-final-form';
import TextField from './TextField';
import { validateYouTubeUrl } from '../../../lib/validation';

const ConditionalYoutubeUrlField = forwardRef(
  ({ name, conditions, ...props }, ref) => {
    // Helper function to check if a single condition is met
    const isConditionMet = (condition, formValues) => {
      return Object.entries(condition).every(([field, expectedValue]) => {
        return formValues[field] === expectedValue;
      });
    };

    // Helper function to check if any condition is met
    const shouldShowField = formValues => {
      if (!conditions || !Array.isArray(conditions)) {
        return false;
      }

      return conditions.some(condition =>
        isConditionMet(condition, formValues)
      );
    };

    // Helper function to determine if field should be required
    const shouldBeRequired = formValues => {
      // If the field is visible, it should be required
      return shouldShowField(formValues);
    };

    return (
      <FormSpy>
        {({ form, values }) => {
          // Get all form values for condition checking
          const formValues = values || {};

          // Only render when at least one condition is met
          if (!shouldShowField(formValues)) {
            return null;
          }

          return (
            <div className='mb-3'>
              <TextField
                ref={ref}
                name={name}
                placeholder={props.placeholder || 'Enter YouTube URL'}
                validate={value => {
                  if (!value) return undefined;
                  const validation = validateYouTubeUrl(value);
                  return validation.isValid ? undefined : validation.error;
                }}
                {...props}
                required={shouldBeRequired(formValues)} // Override any required prop from props
              />
            </div>
          );
        }}
      </FormSpy>
    );
  }
);

ConditionalYoutubeUrlField.displayName = 'ConditionalYoutubeUrlField';
export default ConditionalYoutubeUrlField;
