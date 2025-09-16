'use client';

import React from 'react';
import DeleteItem from '../../../../components/Modifiers/DeleteItem';
import { deleteImageFromFirebase } from '../../../../lib/firebase';
import { deleteMember as deleteMemberService } from '../../../../services/membersService';

const DeleteMember = ({ member, onSuccess, onError, onClose }) => {
  const onDelete = async item => {
    const id = item.id;
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
      onSuccess('Member deleted successfully');
    } catch (err) {
      onError('Failed to delete member');
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
      onClose={onClose}
    />
  );
};

export default DeleteMember;
