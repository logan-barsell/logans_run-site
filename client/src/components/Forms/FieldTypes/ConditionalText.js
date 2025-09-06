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

          return (
            <div className='mb-3'>
              <TextField
                ref={ref}
                name={name}
                {...props}
              />
            </div>
          );
        }}
      </Field>
    );
  }
);

export default ConditionalTextField;
