import React, { forwardRef } from 'react';
import { Field } from 'react-final-form';
import TextField from './TextField';

const ConditionalTextField = forwardRef(
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
              <TextField
                ref={ref}
                name={name}
                {...props}
                required={shouldBeRequired} // Override any required prop from props
              />
            </div>
          );
        }}
      </Field>
    );
  }
);

export default ConditionalTextField;
