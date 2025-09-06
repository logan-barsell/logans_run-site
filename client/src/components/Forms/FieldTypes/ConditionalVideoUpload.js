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

        return (
          <div className='mb-3'>
            <VideoUploadField
              ref={ref}
              name={name}
              {...props}
            />
          </div>
        );
      }}
    </Field>
  );
});

export default ConditionalVideoUploadField;
