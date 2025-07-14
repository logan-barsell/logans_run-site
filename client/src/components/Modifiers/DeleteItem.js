import React from 'react';
import CustomModal from '../Bootstrap/CustomModal';
import { Close } from '../icons';

const DeleteItem = ({
  item,
  onDelete,
  variant = 'square', // 'square' or 'wide'
  buttonText = 'Remove',
  title,
  content,
  isImage = false,
}) => {
  const itemId = item.id || item._id;

  const modalProps = {
    id: `del_item_${itemId}`,
    label: `del_item_label_${itemId}`,
    title,
  };

  const ModalContent = () => {
    return (
      <>
        <p className='modal-body deleteItem'>
          {content || 'Remove this item?'}
        </p>
        <div className='modal-footer'>
          <button
            type='button'
            className='btn btn-dark'
            data-bs-dismiss='modal'
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(item)}
            type='button'
            data-bs-dismiss='modal'
            className='btn btn-danger'
          >
            Delete
          </button>
        </div>
      </>
    );
  };

  const DeleteButton = () => {
    return (
      <button
        className={`btn ${isImage ? 'btn-dark closeBtn' : 'btn-sm btn-danger'}`}
        type='button'
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
      >
        {isImage ? (
          <Close />
        ) : (
          <>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              fill='currentColor'
              className='bi bi-trash-fill'
              viewBox='0 0 16 16'
            >
              <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
            </svg>
            {variant === 'wide' && buttonText}
          </>
        )}
      </button>
    );
  };

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<DeleteButton />}
    >
      <ModalContent />
    </CustomModal>
  );
};

export default DeleteItem;
