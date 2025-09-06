import React from 'react';
import BaseModal from '../Modals/BaseModal';
import ModalForm from './ModalForm';
import Button from '../Button/Button';

const ModalFormWrapper = ({
  onSubmit,
  fields,
  modalProps,
  buttonProps,
  ...formProps
}) => {
  // Extract modal properties
  const {
    id,
    title,
    size = 'md',
    className = '',
    ...modalCallbacks
  } = modalProps || {};

  // Extract button properties
  const {
    text = 'Submit',
    variant = 'danger',
    icon,
    iconPosition,
    ...buttonRest
  } = buttonProps || {};

  // Handle successful form submission
  const handleFormSuccess = () => {
    modalCallbacks.onSuccess?.();
    // Close modal programmatically
    if (modalCallbacks.onClose) {
      modalCallbacks.onClose();
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    modalCallbacks.onCancel?.();
    // Close modal programmatically
    if (modalCallbacks.onClose) {
      modalCallbacks.onClose();
    }
  };

  // Create trigger button
  const trigger = (
    <Button
      variant={variant}
      icon={icon}
      iconPosition={iconPosition}
      {...buttonRest}
    >
      {text}
    </Button>
  );

  return (
    <BaseModal
      id={id}
      title={title}
      size={size}
      className={className}
      trigger={trigger}
      {...modalCallbacks}
    >
      <ModalForm
        fields={fields}
        onSubmit={onSubmit}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        {...formProps}
      />
    </BaseModal>
  );
};

export default ModalFormWrapper;
