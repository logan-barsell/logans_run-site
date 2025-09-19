import './modalForm.css';

import React, { useRef, useState, useCallback } from 'react';
import { Form } from 'react-final-form';

import ConditionalField from './ConditionalField';
import Button from '../Button/Button';
import SaveButton from './SaveButton';

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
  resetMode = 'initial', // 'initial' for AddItem, 'values' for EditItem
}) => {
  // Create refs for all file fields (image and video)
  const fileRefs = useRef({});
  fields.forEach(field => {
    if (
      ['image', 'video'].includes(field.type) &&
      !fileRefs.current[field.name]
    ) {
      fileRefs.current[field.name] = React.createRef();
    }
  });

  // State to track file values for all file fields
  const [fileValues, setFileValues] = useState({});

  // Extract initial values from fields
  const initialValues = fields.reduce((acc, field) => {
    // Don't include file fields in initial values since they should only track file selections
    if (['image', 'video'].includes(field.type)) {
      return acc;
    }

    // Handle single field with initialValue
    if (field.initialValue !== undefined) {
      acc[field.name] = field.initialValue;
    }

    // Handle compound fields with initialValues
    if (field.initialValues !== undefined && typeof field.name === 'object') {
      Object.keys(field.initialValues).forEach(key => {
        acc[field.name[key]] = field.initialValues[key];
      });
    }

    return acc;
  }, {});

  // Callback to update fileValues when a file is selected/cleared
  const handleFileChange = useCallback((name, files) => {
    setFileValues(prev => ({ ...prev, [name]: files }));
  }, []);

  // Helper function to check if a condition is met
  const isConditionMet = (condition, formValues) => {
    return Object.entries(condition).every(([fieldName, expectedValue]) => {
      return formValues[fieldName] === expectedValue;
    });
  };

  // Helper function to check if a field should be visible
  const shouldShowField = (field, formValues) => {
    if (!field.conditions || !Array.isArray(field.conditions)) {
      return true; // No conditions means always visible
    }
    return field.conditions.some(condition =>
      isConditionMet(condition, formValues)
    );
  };

  // Helper function to check if required file fields have values (considering conditional rendering)
  const getFileFieldsRequired = formValues => {
    return fields
      .filter(
        field => ['image', 'video'].includes(field.type) && field.required
      )
      .some(field => {
        // Check if field is actually visible due to conditions
        if (!shouldShowField(field, formValues)) {
          return false; // Field is not visible, so it's not required
        }

        // Field is visible, check if it has a value
        const files = fileValues[field.name];
        return !files || files.length === 0;
      });
  };

  const renderFields = () => {
    return fields.map((field, index) => {
      return (
        <ConditionalField
          key={index}
          field={field}
          fileRef={
            ['image', 'video'].includes(field.type)
              ? fileRefs.current[field.name]
              : undefined
          }
          onFileChange={
            ['image', 'video'].includes(field.type)
              ? handleFileChange
              : undefined
          }
        />
      );
    });
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
        render={({
          handleSubmit,
          form,
          values,
          errors,
          dirty, // React Final Form's built-in "has changes"
          submitting, // React Final Form's built-in "is submitting"
          valid, // React Final Form's built-in validation state
          pristine, // React Final Form's "no changes made"
        }) => {
          // Check file field requirements considering conditional rendering
          const fileFieldsRequired = getFileFieldsRequired(values);

          const handleFormSubmit = async event => {
            try {
              await handleSubmit(event);
              // Success - reset form and close modal
              form.reset(resetMode === 'initial' ? initialValues : values);
              closeModal?.();
              onSuccess?.();
            } catch (error) {
              // Error handling - form stays open
              console.error('Form submission error:', error);
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
                      // Clear all file upload fields via refs
                      Object.values(fileRefs.current).forEach(ref => {
                        if (
                          ref &&
                          ref.current &&
                          typeof ref.current.clear === 'function'
                        ) {
                          ref.current.clear();
                        }
                      });
                      setFileValues({});
                      form.reset();
                      handleCancel();
                    }}
                  >
                    {cancelButtonText}
                  </Button>
                </div>
                <div className='d-grid col-6'>
                  <SaveButton
                    hasChanges={dirty}
                    isDirty={dirty}
                    isSaving={submitting}
                    isSaved={false}
                    saveText={submitButtonText}
                    savedText=''
                    savingText='Submitting...'
                    buttonType='submit'
                    className={`btn btn-${submitButtonVariant} submitForm`}
                    disabled={
                      !valid ||
                      fileFieldsRequired || // Now considers conditional rendering
                      pristine ||
                      submitting
                    }
                  />
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
