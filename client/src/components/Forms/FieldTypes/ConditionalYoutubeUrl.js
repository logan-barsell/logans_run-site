import React, { forwardRef } from 'react';
import { Field } from 'react-final-form';
import TextField from './TextField';
import { validateYouTubeUrl } from '../../../utils/validation';

const ConditionalYoutubeUrlField = forwardRef(
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
                placeholder={props.placeholder || 'Enter YouTube URL'}
                validate={value => {
                  if (!value) return undefined;
                  const validation = validateYouTubeUrl(value);
                  return validation.isValid ? undefined : validation.error;
                }}
                {...props}
              />
            </div>
          );
        }}
      </Field>
    );
  }
);

export default ConditionalYoutubeUrlField;
