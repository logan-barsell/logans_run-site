import React, { useMemo } from 'react';
import ModalForm from '../Forms/ModalForm';
import BaseModal from '../Modals/BaseModal';
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
  // Handle different data structures - some items have data nested under .data
  const itemData = item.data || item;
  const id = itemData._id || itemData.id || item._id || item.id;

  // Memoize the fields to prevent re-creation on every render
  const fields = useMemo(() => {
    if (!editFields || !item) return null;
    return editFields(itemData, false);
  }, [editFields, itemData, item]);

  const iconPosition = variant === 'square' ? 'center' : 'left';

  // Handle successful form submission
  const handleFormSuccess = () => {
    // Modal will be closed automatically by BaseModal
  };

  return (
    <BaseModal
      id={
        id
          ? `edit_item_${id}`
          : `edit_item_${Math.random().toString(36).substr(2, 9)}`
      }
      title={title}
      trigger={
        <Button
          variant='dark'
          size='sm'
          icon={<PencilSquare />}
          iconPosition={iconPosition}
          type='button'
        >
          {variant === 'wide' && buttonText}
        </Button>
      }
      onSuccess={handleFormSuccess}
    >
      {fields ? (
        <ModalForm
          fields={fields}
          onSubmit={data => onEdit(data, itemData)}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <div>No edit fields provided</div>
      )}
    </BaseModal>
  );
};

export default EditItem;
