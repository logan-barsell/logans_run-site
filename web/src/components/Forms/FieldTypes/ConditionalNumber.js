import React, { forwardRef } from 'react';
import { Field } from 'react-final-form';
import NumberField from './NumberField';

const ConditionalNumberField = forwardRef(
  ({ name, conditionField, conditionValue, ...props }, ref) => {
    return (
      <Field name={conditionField}>
        {({ input: conditionInput }) => {
          // Only render when condition matches
          if (conditionInput.value !== conditionValue) {
            return null;
          }

          // If the field is visible, it should be required
          const shouldBeRequired = conditionInput.value === conditionValue;

          return (
            <div className='mb-3'>
              <NumberField
                ref={ref}
                name={name}
                required={shouldBeRequired}
                {...props}
              />
            </div>
          );
        }}
      </Field>
    );
  }
);

ConditionalNumberField.displayName = 'ConditionalNumberField';
export default ConditionalNumberField;
