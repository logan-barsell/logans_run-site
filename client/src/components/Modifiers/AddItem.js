import React, { useState } from 'react';
import BaseModal from '../Modals/BaseModal';
import ModalForm from '../Forms/ModalForm';
import { PlusSquareFill } from '../icons';
import Button from '../Button/Button';

const AddItem = ({
  fields,
  onAdd,
  onClose, // NEW: callback for when modal closes
  buttonText = 'Add',
  title = 'ADD ITEM',
  modalProps = {},
  modalButton,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async formFields => {
    setLoading(true);
    try {
      await onAdd(formFields);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err; // Re-throw to prevent modal from closing
    }
  };

  const defaultModalId = modalProps?.id || 'add_item_modal';

  const DefaultAddButton = () => {
    return (
      <Button
        variant='danger'
        icon={<PlusSquareFill />}
        loading={loading}
        type='button'
        className='addButton'
      >
        {loading ? 'Uploading...' : buttonText}
      </Button>
    );
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    // Modal will be closed automatically by BaseModal
  };

  return (
    <BaseModal
      id={defaultModalId}
      title={title}
      trigger={modalButton || <DefaultAddButton />}
      onClose={onClose} // NEW: pass onClose to BaseModal
      onSuccess={handleFormSuccess}
    >
      <ModalForm
        fields={fields}
        onSubmit={handleSubmit}
        onSuccess={handleFormSuccess}
        loading={loading}
        resetMode='initial'
        {...rest}
      />
    </BaseModal>
  );
};

export default AddItem;
