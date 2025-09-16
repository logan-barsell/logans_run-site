import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { CustomForm, SaveButton } from './index';
import RenderField from './RenderField';

/**
 * EditableForm - A reusable form component for editable data with save functionality
 * Now uses react-final-form for consistent form handling
 *
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {string} props.containerId - Container ID for styling
 * @param {Array} props.fields - Array of field configurations
 * @param {Object} props.initialValues - Initial form values from Redux/API
 * @param {Function} props.onSubmit - Submit function to call
 * @param {Function} props.onSuccess - Optional success callback
 * @param {Function} props.onError - Optional error callback
 * @param {Function} props.transformData - Optional function to transform data before submit
 * @param {Object} props.formProps - Additional props to pass to the form
 * @param {boolean} props.loading - Whether form is in loading state
 * @param {boolean} props.hideDefaultSaveButton - Whether to hide the default SaveButton
 * @param {string} props.successMessage - Custom success message (default: "Update Successful")
 * @param {number} props.successDuration - How long to show success message in ms (default: 3000)
 */
const EditableForm = ({
  title,
  containerId,
  fields = [],
  initialValues = {},
  onSubmit,
  onSuccess,
  onError,
  transformData = null,
  formProps = {},
  loading = false,
  children, // Custom content to render before fields
  hideDefaultSaveButton = false, // Option to hide the default SaveButton
  successMessage = 'Update Successful', // Custom success message
  ignoreDirtyFields = [], // Field names to ignore for dirty/pristine detection
  ...props
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [baselineValues, setBaselineValues] = useState(initialValues || {});

  // Keep internal baseline in sync when external initialValues change (e.g., after fetch)
  useEffect(() => {
    setBaselineValues(initialValues || {});
  }, [initialValues]);

  const handleFormSubmit = async (values, form) => {
    try {
      // Transform data if provided, otherwise use values directly
      const dataToSubmit = transformData ? transformData(values) : values;

      await onSubmit(dataToSubmit);

      // Update the form's initial values to match current values (makes form pristine)
      form.batch(() => {
        Object.keys(dataToSubmit).forEach(key => {
          form.change(key, dataToSubmit[key]);
        });
        form.reset(dataToSubmit);
      });

      // Indicate success (SaveButton will show success text and be disabled)
      setIsSaved(true);

      // Update internal baseline so subsequent change detection compares against saved values
      setBaselineValues(dataToSubmit);

      if (onSuccess) {
        onSuccess(form);
      }
    } catch (err) {
      console.error('Form submit failed:', err);
      if (onError) {
        onError(err);
      }
      throw err; // Re-throw to let react-final-form handle submission state
    }
  };

  return (
    <CustomForm
      title={title}
      containerId={containerId}
      {...props}
    >
      <Form
        onSubmit={(values, form) => handleFormSubmit(values, form)}
        initialValues={initialValues}
        keepDirtyOnReinitialize={false}
        subscription={{
          values: true,
          errors: true,
          pristine: true,
          submitting: true,
          dirty: true,
        }}
        render={({
          handleSubmit,
          form,
          values,
          errors,
          pristine,
          submitting,
          dirty,
        }) => {
          const hasValidationErrors = Object.keys(errors || {}).length > 0;

          // Reset isSaved flag when form becomes dirty (any field changes)
          if (dirty && isSaved) {
            setIsSaved(false);
          }

          // Fix pristine state calculation to handle missing fields using internal baseline
          let actualPristine = pristine;
          if (baselineValues && values) {
            const baselineKeys = Object.keys(baselineValues).filter(
              key => !ignoreDirtyFields.includes(key)
            );
            const allFieldsMatch = baselineKeys.every(key => {
              const baselineValue = baselineValues[key] ?? '';
              const currentValue = values[key] ?? '';
              return baselineValue === currentValue;
            });
            actualPristine = allFieldsMatch;
          }

          const hasChanges = !actualPristine;
          const isSubmitting = submitting || loading;

          return (
            <form
              onSubmit={handleSubmit}
              {...formProps}
              onChange={e => {
                if (formProps && typeof formProps.onChange === 'function') {
                  formProps.onChange(e);
                }
                if (isSaved) {
                  setIsSaved(false);
                }
              }}
            >
              {/* Render custom content if provided */}
              {children && (
                <div className='mb-4'>
                  {typeof children === 'function'
                    ? children({ values, form, pristine, submitting })
                    : children}
                </div>
              )}

              {/* Render fields using RenderField component */}
              {fields.map((field, index) => (
                <div
                  key={field.name || index}
                  className='mb-sm-3 mb-2'
                >
                  <RenderField field={field} />
                </div>
              ))}

              {!hideDefaultSaveButton && (
                <div className='mt-5 d-grid col-12 sm:col-6 mx-auto'>
                  <SaveButton
                    hasChanges={hasChanges}
                    isDirty={hasChanges}
                    isSaving={isSubmitting}
                    isSaved={isSaved}
                    savedText={successMessage}
                    disabled={
                      !hasChanges ||
                      hasValidationErrors ||
                      isSubmitting ||
                      isSaved
                    }
                  />
                </div>
              )}
            </form>
          );
        }}
      />
    </CustomForm>
  );
};

export default EditableForm;
