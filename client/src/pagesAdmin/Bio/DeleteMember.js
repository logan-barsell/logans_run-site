import React from 'react';
import DeleteItem from '../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../utils/firebaseImage';
import { useAlert } from '../../contexts/AlertContext';
import { deleteMember as deleteMemberService } from '../../services/membersService';

const DeleteMember = ({ member, fetchMembers }) => {
  const { showError, showSuccess } = useAlert();

  const onDelete = async item => {
    const id = item._id || item.id;
    try {
      // Try to delete image, but don't fail the entire operation if it fails
      if (member && member.bioPic) {
        try {
          await deleteImageFromFirebase(member.bioPic);
        } catch (imageError) {
          console.warn('Failed to delete image from Firebase:', imageError);
          // Continue with record deletion even if image deletion fails
        }
      }

      await deleteMemberService(id);
      showSuccess('Member deleted successfully');
      fetchMembers();
    } catch (err) {
      showError('Failed to delete member');
    }
  };

  return (
    <DeleteItem
      item={member}
      title='DELETE MEMBER'
      content={
        <>
          Remove <span>{member.name}</span> from members?
        </>
      }
      onDelete={onDelete}
    />
  );
};

export default DeleteMember;
