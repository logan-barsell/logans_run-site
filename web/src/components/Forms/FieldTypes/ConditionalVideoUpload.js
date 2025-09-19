import React, { forwardRef } from 'react';
import { Field } from 'react-final-form';
import { VideoUploadField } from './VideoUpload';

const ConditionalVideoUploadField = forwardRef(({ name, ...props }, ref) => {
  return (
    <Field name='videoType'>
      {({ input: videoTypeInput }) => {
        // Only render video upload when videoType is 'upload'
        if (videoTypeInput.value !== 'upload') {
          return null;
        }

        // If the field is visible, it should be required
        const shouldBeRequired = videoTypeInput.value === 'upload';

        return (
          <div className='mb-3'>
            <VideoUploadField
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
});

export default ConditionalVideoUploadField;
