import React, { useMemo } from 'react';
import ModalForm from '../Forms/ModalForm';
import CustomModal from '../Modals/CustomModal';
import { PencilSquare } from '../icons';
import Button from '../Button/Button';

const EditItem = ({
  item,
  editFields,
  onEdit,
  variant = 'square', // 'square' or 'wide'
  buttonText = 'Edit',
  title,
}) => {
  const id = item._id || item.id;

  // Memoize the fields to prevent re-creation on every render
  const fields = useMemo(() => {
    if (!editFields || !item) return null;
    return editFields(item.data || item, false);
  }, [editFields, item]);

  const modalProps = {
    id: `edit_item_${id}`,
    label: `edit_item_label_${id}`,
    title,
  };

  const iconPosition = variant === 'square' ? 'center' : 'left';

  const EditButton = () => {
    return (
      <Button
        variant='dark'
        size='sm'
        icon={<PencilSquare />}
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        iconPosition={iconPosition}
        type='button'
      >
        {variant === 'wide' && buttonText}
      </Button>
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
