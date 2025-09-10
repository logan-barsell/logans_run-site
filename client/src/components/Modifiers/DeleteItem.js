import React from 'react';
import BaseModal from '../Modals/BaseModal';
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
  const [modalCloseFn, setModalCloseFn] = React.useState(null);
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
      onSuccess={handleDeleteSuccess}
      onCloseModal={handleCloseModalCallback}
    >
      <p className='modal-body deleteItem'>{content || 'Remove this item?'}</p>
      <div className='modal-footer'>
        <Button
          type='button'
          variant='dark'
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
            if (modalCloseFn) {
              modalCloseFn();
            }
            await onDelete(item);
          }}
          type='button'
          variant='danger'
        >
          Delete
        </Button>
      </div>
    </BaseModal>
  );
};

export default DeleteItem;
