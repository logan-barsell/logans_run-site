import React from 'react';
import { Check } from '../icons';

/**
 * Reusable Save Button component with change detection
 *
 * @param {Object} props
 * @param {boolean} props.hasChanges - Whether there are unsaved changes
 * @param {boolean} props.isDirty - Whether the form has been modified
 * @param {boolean} props.isSaving - Whether a save operation is in progress
 * @param {boolean} props.isSaved - Whether the last save was successful
 * @param {boolean} props.disabled - Override disabled state
 * @param {Function} props.onSave - Function to call when save is clicked
 * @param {string} props.saveText - Text to show on save button (default: "Save Changes")
 * @param {string} props.savedText - Text to show when saved (default: "Update Successful")
 * @param {string} props.savingText - Text to show while saving (default: "Saving...")
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.buttonType - Button type (default: "submit")
 */
const SaveButton = ({
  hasChanges = false,
  isDirty = false,
  isSaving = false,
  isSaved = false,
  disabled: externalDisabled = null,
  onSave,
  saveText = 'Save Changes',
  savedText = 'Update Successful',
  savingText = 'Saving...',
  className = 'btn btn-danger submitForm',
  buttonType = 'submit',
  ...props
}) => {
  // Use external disabled prop if provided, otherwise use internal logic
  const isDisabled =
    externalDisabled !== null
      ? externalDisabled
      : !hasChanges || !isDirty || isSaving;

  const handleClick = e => {
    if (buttonType !== 'submit' && onSave) {
      e.preventDefault();
      onSave();
    }
  };

  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          {savingText}
          <span
            className='spinner-border spinner-border-sm ms-2'
            role='status'
            aria-hidden='true'
          ></span>
        </>
      );
    }

    if (isSaved) {
      return (
        <>
          {savedText} &nbsp;
          <Check />
        </>
      );
    }

    return saveText;
  };

  return (
    <button
      type={buttonType}
      className={className}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {getButtonContent()}
    </button>
  );
};

export default SaveButton;
