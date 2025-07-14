import React, { useState } from 'react';
import CustomModal from '../Bootstrap/CustomModal';
import ModalForm from '../Forms/ModalForm';

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
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async formFields => {
    setLoading(true);
    try {
      // If any field is an image, pass setUploadProgress to onAdd
      const hasImage = fields.some(f => f.type === 'image');
      if (hasImage) {
        await onAdd(formFields, setUploadProgress);
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
    buttonText: loading
      ? `Uploading... ${String(uploadProgress).replace('0', 'O')}%`
      : buttonText,
    ...modalProps,
  };

  const DefaultAddButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${defaultModalProps.id}`}
      className='addButton btn btn-danger'
      type='button'
      disabled={loading}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='currentColor'
        className='bi bi-plus-square-fill'
        viewBox='0 0 16 16'
      >
        <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
      </svg>
      {defaultModalProps.buttonText}
    </button>
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
