import React from 'react';
import CustomModal from '../Modals/CustomModal';
import { Close, TrashFill } from '../icons';
import Button from '../Button/Button';

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

  const iconPosition = variant === 'square' ? 'center' : 'left';

  const ModalContent = () => {
    return (
      <>
        <p className='modal-body deleteItem'>
          {content || 'Remove this item?'}
        </p>
        <div className='modal-footer'>
          <Button
            type='button'
            variant='dark'
            data-bs-dismiss='modal'
          >
            Cancel
          </Button>
          <Button
            onClick={() => onDelete(item)}
            type='button'
            variant='danger'
            data-bs-dismiss='modal'
          >
            Delete
          </Button>
        </div>
      </>
    );
  };

  // Custom close button for images that preserves original styling
  const ImageCloseButton = () => (
    <button
      className='closeBtn'
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      type='button'
    >
      <Close />
    </button>
  );

  const DeleteButton = () => {
    // Use custom close button for images, Button component for everything else
    if (isImage) {
      return <ImageCloseButton />;
    }

    return (
      <Button
        variant='danger'
        size='sm'
        icon={<TrashFill />}
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        type='button'
        iconPosition={iconPosition}
      >
        {variant === 'wide' && buttonText}
      </Button>
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
