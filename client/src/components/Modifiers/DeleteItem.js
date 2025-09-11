import React from 'react';
import BaseModal from '../Modals/BaseModal';
import { Close, TrashFill } from '../icons';
import Button from '../Button/Button';

const DeleteItem = ({
  item,
  onDelete,
  onClose, // NEW: callback for when modal closes
  variant = 'square', // 'square' or 'wide'
  buttonText = 'Remove',
  title,
  content,
  isImage = false,
}) => {
  const [modalCloseFn, setModalCloseFn] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const itemId = item.id;

  // Callback to receive closeModal function from BaseModal
  const handleCloseModalCallback = React.useCallback(closeFn => {
    setModalCloseFn(() => closeFn);
  }, []);

  const iconPosition = variant === 'square' ? 'center' : 'left';

  // Handle successful deletion
  const handleDeleteSuccess = () => {
    // Modal will be closed automatically by BaseModal
  };

  return (
    <BaseModal
      id={`del_item_${itemId}`}
      title={title}
      trigger={
        isImage ? (
          <button
            className='closeBtn'
            type='button'
          >
            <Close />
          </button>
        ) : (
          <Button
            variant='danger'
            size='sm'
            icon={<TrashFill />}
            type='button'
            iconPosition={iconPosition}
          >
            {variant === 'wide' && buttonText}
          </Button>
        )
      }
      onClose={onClose} // NEW: pass onClose to BaseModal
      onSuccess={handleDeleteSuccess}
      onCloseModal={handleCloseModalCallback}
    >
      <p className='modal-body deleteItem'>{content || 'Remove this item?'}</p>
      <div className='modal-footer'>
        <Button
          type='button'
          variant='dark'
          disabled={isDeleting}
          onClick={() => {
            if (modalCloseFn) {
              modalCloseFn();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setIsDeleting(true);
            try {
              await onDelete(item); // Complete the delete operation first
              if (modalCloseFn) {
                modalCloseFn(); // Then close the modal
              }
            } catch (error) {
              // Reset loading state on error
              setIsDeleting(false);
              throw error; // Re-throw to let parent handle the error
            }
          }}
          type='button'
          variant='danger'
          loading={isDeleting}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteItem;
