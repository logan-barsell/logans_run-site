import React from 'react';
import CustomModal from '../../components/Bootstrap/CustomModal';
import { X as XIcon } from '../../components/icons';

const RemoveImage = ({ item, onDelete }) => {
  const modalProps = {
    id: `del_item_${item._id}`,
    label: `del_item_label_${item._id}`,
    title: `DELETE IMAGE`,
  };

  const ModalContent = () => {
    return (
      <>
        <div className='modal-body deleteItem'>Remove from Media Page?</div>
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
        type='button'
        className='btn btn-dark'
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
      >
        <XIcon />
      </button>
    );
  };

  return (
    <>
      <CustomModal
        modalProps={modalProps}
        modalButton={<DeleteButton />}
      >
        <ModalContent />
      </CustomModal>
    </>
  );
};

export default RemoveImage;
