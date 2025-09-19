import React, { forwardRef } from 'react';
import { FormSpy } from 'react-final-form';
import RenderField from './RenderField';

const ConditionalField = forwardRef(({ field, fileRef, ...props }, ref) => {
  const { conditions, required, ...fieldProps } = field;

  // If no conditions are specified, render the field normally
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    return (
      <RenderField
        ref={fileRef || ref}
        field={field}
        {...props}
      />
    );
  }

  // Helper function to check if a single condition is met
  const isConditionMet = (condition, formValues) => {
    return Object.entries(condition).every(([fieldName, expectedValue]) => {
      return formValues[fieldName] === expectedValue;
    });
  };

  // Helper function to check if any condition is met
  const shouldShowField = formValues => {
    return conditions.some(condition => isConditionMet(condition, formValues));
  };

  // Helper function to determine if field should be required
  const shouldBeRequired = formValues => {
    // If the field is visible and was originally required, it should be required
    return shouldShowField(formValues) && required;
  };

  return (
    <FormSpy>
      {({ values }) => {
        // Get all form values for condition checking
        const formValues = values || {};

        // Only render when at least one condition is met
        if (!shouldShowField(formValues)) {
          return null;
        }

        // Create a new field object with the conditional required state
        const conditionalField = {
          ...fieldProps,
          required: shouldBeRequired(formValues),
        };

        return (
          <RenderField
            ref={fileRef || ref}
            field={conditionalField}
            {...props}
          />
        );
      }}
    </FormSpy>
  );
});

ConditionalField.displayName = 'ConditionalField';
export default ConditionalField;
