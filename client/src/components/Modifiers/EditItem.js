import React from 'react';
import ModalForm from '../Forms/ModalForm';
import CustomModal from '../Bootstrap/CustomModal';

const EditItem = ({
  item,
  editFields,
  onEdit,
  variant = 'square', // 'square' or 'wide'
  buttonText = 'Edit',
  title,
}) => {
  const id = item._id || item.id;
  const fields = editFields ? editFields(item.data || item, false) : null;

  const modalProps = {
    id: `edit_item_${id}`,
    label: `edit_item_label_${id}`,
    title,
  };

  const EditButton = () => {
    return (
      <button
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        className='btn btn-sm btn-dark align-middle'
        type='button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          className='bi bi-pencil-square'
          viewBox='0 0 16 16'
        >
          <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
          <path
            fillRule='evenodd'
            d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
          />
        </svg>
        {variant === 'wide' && buttonText}
      </button>
    );
  };

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<EditButton />}
    >
      {fields ? (
        <ModalForm
          fields={fields}
          onSubmit={data => onEdit(data)}
        />
      ) : (
        <div>No edit fields provided</div>
      )}
    </CustomModal>
  );
};

export default EditItem;
