import './modalForm.css';

import React, { useRef, useState, useCallback } from 'react';
import { Form } from 'react-final-form';

import RenderField from './RenderField';
import Button from '../Button/Button';

const ModalForm = ({ onSubmit, fields }) => {
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
    if (typeof initial !== typeof current) {
      return false;
    }

    if (typeof initial !== 'object' || initial === null || current === null) {
      return initial === current;
    }

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
    setImageValues({});
    setIsSubmitting(false);
    setHasChanges(false);
  };

  const closeModal = () => {
    // Find the modal element and close it using Bootstrap's modal API
    const modalElement = document.querySelector('.modal.show');
    if (modalElement) {
      // Use the data-bs-dismiss attribute to trigger modal close
      const closeButton = modalElement.querySelector(
        '[data-bs-dismiss="modal"]'
      );
      if (closeButton) {
        closeButton.click();
      } else {
        // Fallback: manually hide the modal
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    }
  };

  return (
    <div className='col-lg final-form'>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        subscription={{ values: true, errors: true }}
        render={({ handleSubmit, form, values, errors }) => {
          // Check for changes whenever values change
          const changed = !compareValues(initialValues, values);
          if (changed !== hasChanges) {
            setHasChanges(changed);
          }

          const handleFormSubmit = async event => {
            setIsSubmitting(true);
            try {
              const error = await handleSubmit(event);
              if (error) {
                return error;
              }
              onFormRestart(form);
              closeModal(); // Close modal on successful submission
            } finally {
              setIsSubmitting(false);
            }
          };

          return (
            <form onSubmit={handleFormSubmit}>
              <div className='modal-body mx-auto mx-sm-4 my-3'>
                {renderFields()}
              </div>
              <div className='modal-footer'>
                <div className='d-grid col-auto'>
                  <Button
                    variant='dark'
                    type='button'
                    data-bs-dismiss='modal'
                    onClick={() => {
                      onFormRestart(form);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div className='d-grid col-6'>
                  <Button
                    variant='danger'
                    type='submit'
                    disabled={
                      Object.keys(errors || {}).length !== 0 ||
                      imageRequired ||
                      !hasChanges ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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
