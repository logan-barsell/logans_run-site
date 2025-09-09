import React, { forwardRef } from 'react';
import { Field } from 'react-final-form';
import { ImageUploadField } from './ImageUpload';

const ConditionalImageUploadField = forwardRef(
  ({ name, conditionField, conditionValue, ...props }, ref) => {
    return (
      <Field name={conditionField}>
        {({ input: conditionInput }) => {
          // Only render when condition matches
          if (conditionInput.value !== conditionValue) {
            return null;
          }

          return (
            <ImageUploadField
              ref={ref}
              name={name}
              {...props}
            />
          );
        }}
      </Field>
    );
  }
);

export default ConditionalImageUploadField;
