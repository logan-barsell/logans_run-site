import React, { useState, useEffect } from 'react';
import { CustomForm, SaveButton } from './index';
import { useFormChanges } from '../../hooks/useFormChanges';

/**
 * EditableForm - A reusable form component for editable data with save functionality
 *
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {string} props.containerId - Container ID for styling
 * @param {Object} props.initialData - Initial/saved data from Redux/API
 * @param {Function} props.onSave - Save function to call
 * @param {Function} props.onSuccess - Optional success callback
 * @param {Function} props.onError - Optional error callback
 * @param {Function} props.compareFunction - Optional custom comparison function
 * @param {Function} props.transformData - Optional function to transform data before save
 * @param {Object} props.validationErrors - Optional validation errors object
 * @param {React.ReactNode} props.children - Form fields (render prop pattern)
 * @param {Object} props.formProps - Additional props to pass to the form
 */
const EditableForm = ({
  title,
  containerId,
  initialData,
  onSave,
  onSuccess,
  onError,
  compareFunction = null,
  transformData = null,
  validationErrors = {},
  children,
  formProps = {},
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize form data when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsSaved(false);
    }
  }, [initialData]);

  // Use change detection hook
  const { hasChanges, isDirty, markAsSaved, saveButtonDisabled } =
    useFormChanges(initialData, formData, compareFunction);

  // Check if there are any validation errors
  const hasValidationErrors = Object.keys(validationErrors).some(
    key => validationErrors[key] !== null && validationErrors[key] !== undefined
  );

  const handleInputChange = e => {
    const { name, value } = e.target;

    // Handle boolean values (for radio buttons and checkboxes)
    let processedValue = value;
    if (value === 'true') {
      processedValue = true;
    } else if (value === 'false') {
      processedValue = false;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    setIsSaved(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Prevent submission if there are validation errors
    if (hasValidationErrors) {
      return;
    }

    if (saveButtonDisabled) return;

    setIsSaving(true);
    try {
      // Transform data if provided, otherwise use formData directly
      const dataToSave = transformData ? transformData(formData) : formData;

      await onSave(dataToSave);
      markAsSaved();
      setIsSaved(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Form save failed:', err);
      if (onError) {
        onError(err);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Create context for form fields to access
  const formContext = {
    formData,
    handleInputChange,
    isSaving,
    isSaved,
    hasChanges,
    isDirty,
  };

  return (
    <CustomForm
      title={title}
      containerId={containerId}
      {...props}
    >
      <form
        onSubmit={handleSubmit}
        {...formProps}
      >
        {/* Render children with form context */}
        {typeof children === 'function' ? children(formContext) : children}

        <div className='mt-5 d-grid col-12 sm:col-6 mx-auto'>
          <SaveButton
            hasChanges={hasChanges}
            isDirty={isDirty}
            isSaving={isSaving}
            isSaved={isSaved}
            disabled={saveButtonDisabled || hasValidationErrors}
          />
        </div>
      </form>
    </CustomForm>
  );
};

export default EditableForm;
