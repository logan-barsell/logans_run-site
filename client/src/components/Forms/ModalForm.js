import './modalForm.css';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Form } from 'react-final-form';

import RenderField from './RenderField';
import Button from '../Button/Button';

const ModalForm = ({
  onSubmit,
  fields,
  onSuccess,
  onCancel,
  closeModal, // From BaseModal
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  submitButtonVariant = 'danger',
  cancelButtonVariant = 'dark',
  isModal = true, // For backward compatibility
}) => {
  // Create refs for all image fields
  const imageRefs = useRef({});
  fields.forEach(field => {
    if (field.type === 'image' && !imageRefs.current[field.name]) {
      imageRefs.current[field.name] = React.createRef();
    }
  });

  // State to track file values for all image fields
  const [imageValues, setImageValues] = useState({});

  // State to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track if form has meaningful changes
  const [hasChanges, setHasChanges] = useState(false);

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Safe state setter that only updates if component is mounted
  const safeSetState = useCallback((setter, value) => {
    if (isMountedRef.current) {
      setter(value);
    }
  }, []);

  // Extract initial values from fields
  const initialValues = fields.reduce((acc, field) => {
    // Don't include image fields in initial values since they should only track file selections
    if (field.initialValue !== undefined && field.type !== 'image') {
      acc[field.name] = field.initialValue;
    }
    return acc;
  }, {});

  // Callback to update imageValues when a file is selected/cleared
  const handleFileChange = useCallback((name, files) => {
    setImageValues(prev => ({ ...prev, [name]: files }));
  }, []);

  // Helper to check if all required image fields have a value
  const imageRequired = fields
    .filter(field => field.type === 'image' && field.required)
    .some(field => {
      const files = imageValues[field.name];
      return !files || files.length === 0;
    });

  // Deep comparison function for form values
  const compareValues = useCallback((initial, current) => {
    // Handle Date objects - compare by timestamp
    if (initial instanceof Date && current instanceof Date) {
      return initial.getTime() === current.getTime();
    }

    // Handle case where one is Date and other isn't
    if (initial instanceof Date || current instanceof Date) {
      return false;
    }

    // Handle null/undefined cases
    if (initial === null && current === null) return true;
    if (initial === undefined && current === undefined) return true;
    if (initial === null || current === null) return false;
    if (initial === undefined || current === undefined) return false;

    // Handle different types
    if (typeof initial !== typeof current) {
      return false;
    }

    // Handle primitive types
    if (typeof initial !== 'object') {
      // Handle numeric string conversion for number inputs
      if (typeof initial === 'number' && typeof current === 'string') {
        const currentAsNumber = Number(current);
        if (!isNaN(currentAsNumber)) {
          return initial === currentAsNumber;
        }
      }
      if (typeof current === 'number' && typeof initial === 'string') {
        const initialAsNumber = Number(initial);
        if (!isNaN(initialAsNumber)) {
          return initialAsNumber === current;
        }
      }

      return initial === current;
    }

    // Handle arrays
    if (Array.isArray(initial) !== Array.isArray(current)) {
      return false;
    }

    if (Array.isArray(initial)) {
      if (initial.length !== current.length) {
        return false;
      }
      return initial.every((item, index) =>
        compareValues(item, current[index])
      );
    }

    // Handle objects
    const initialKeys = Object.keys(initial);
    const currentKeys = Object.keys(current);

    if (initialKeys.length !== currentKeys.length) {
      return false;
    }

    return initialKeys.every(key => compareValues(initial[key], current[key]));
  }, []);

  const renderFields = () => {
    return fields.map((field, index) => {
      return (
        <RenderField
          key={index}
          field={field}
          imageRef={
            field.type === 'image' ? imageRefs.current[field.name] : undefined
          }
          onFileChange={field.type === 'image' ? handleFileChange : undefined}
        />
      );
    });
  };

  const onFormRestart = form => {
    form.restart();
    // Clear all image upload fields via refs
    Object.values(imageRefs.current).forEach(ref => {
      if (ref && ref.current && typeof ref.current.clear === 'function') {
        ref.current.clear();
      }
    });
    safeSetState(setImageValues, {});
    safeSetState(setIsSubmitting, false);
    safeSetState(setHasChanges, false);
  };

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    // Use onCancel if provided, otherwise use closeModal from BaseModal
    if (onCancel) {
      onCancel();
    } else if (closeModal) {
      closeModal();
    }
  }, [onCancel, closeModal]);

  return (
    <div className='col-lg final-form'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        subscription={{ values: true, errors: true }}
        render={({ handleSubmit, form, values, errors }) => {
          // Check for changes whenever values change
          const changed = !compareValues(initialValues, values);
          // Update hasChanges state if it changed
          if (changed !== hasChanges) {
            // Use requestAnimationFrame to defer the state update
            requestAnimationFrame(() => safeSetState(setHasChanges, changed));
          }

          const handleFormSubmit = async event => {
            setIsSubmitting(true);
            try {
              const result = await handleSubmit(event);
              if (result) {
                return result; // Return validation errors
              }
              // Success - clean up form first
              onFormRestart(form);
              // Call success callback (which can handle modal closing)
              onSuccess?.();
            } finally {
              safeSetState(setIsSubmitting, false);
            }
          };

          return (
            <form onSubmit={handleFormSubmit}>
              <div className='modal-body mx-auto mx-sm-4 my-3'>
                {renderFields()}
              </div>
              <div className={isModal ? 'modal-footer' : 'form-footer'}>
                <div className='d-grid col-auto'>
                  <Button
                    variant={cancelButtonVariant}
                    type='button'
                    onClick={() => {
                      onFormRestart(form);
                      handleCancel();
                    }}
                  >
                    {cancelButtonText}
                  </Button>
                </div>
                <div className='d-grid col-6'>
                  <Button
                    variant={submitButtonVariant}
                    type='submit'
                    disabled={
                      Object.keys(errors || {}).length !== 0 ||
                      imageRequired ||
                      !hasChanges ||
                      isSubmitting ||
                      // Check if any required fields are empty
                      fields.some(
                        field => field.required && !values[field.name]
                      )
                    }
                  >
                    {isSubmitting ? 'Submitting...' : submitButtonText}
                  </Button>
                </div>
              </div>
            </form>
          );
        }}
      />
    </div>
  );
};

export default ModalForm;
