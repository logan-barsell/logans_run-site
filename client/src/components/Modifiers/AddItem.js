import React, { useState } from 'react';
import CustomModal from '../Modals/CustomModal';
import ModalForm from '../Forms/ModalForm';
import { PlusSquareFill } from '../icons';
import Button from '../Button/Button';

const AddItem = ({
  fields,
  onAdd,
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
      // If any field is an image, pass a no-op function to onAdd (for backward compatibility)
      const hasImage = fields.some(f => f.type === 'image');
      if (hasImage) {
        await onAdd(formFields, () => {}); // Pass empty function instead of setUploadProgress
      } else {
        await onAdd(formFields);
      }
      setLoading(false);
      // Close modal on success
      document
        .getElementById(modalProps.id || 'add_item_modal')
        ?.closest('.modal')
        ?.querySelector('[data-bs-dismiss="modal"]')
        ?.click();
    } catch (err) {
      setLoading(false);
    }
  };

  const defaultModalProps = {
    id: modalProps.id || 'add_item_modal',
    label: modalProps.label || 'add_item_modal',
    title,
    buttonText: loading ? 'Uploading...' : buttonText,
    ...modalProps,
  };

  const DefaultAddButton = () => (
    <Button
      variant='danger'
      icon={<PlusSquareFill />}
      loading={loading}
      data-bs-toggle='modal'
      data-bs-target={`#${defaultModalProps.id}`}
      type='button'
      className='addButton'
    >
      {defaultModalProps.buttonText}
    </Button>
  );

  return (
    <CustomModal
      modalProps={defaultModalProps}
      modalButton={modalButton || <DefaultAddButton />}
    >
      <ModalForm
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        {...rest}
      />
    </CustomModal>
  );
};

export default AddItem;
