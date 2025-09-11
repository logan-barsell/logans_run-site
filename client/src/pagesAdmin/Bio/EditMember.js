import React from 'react';
import EditItem from '../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebase';
import { editMemberFields } from './constants';
import { normalizeUrl } from '../../utils/strings';
import { updateMember as updateMemberService } from '../../services/membersService';

const EditMember = ({ member, onSuccess, onError, onClose }) => {
  const onEdit = async fields => {
    try {
      let imageUrl = member.bioPic || '';

      // Only process image upload if a new file was actually selected
      if (
        fields.bioPic &&
        fields.bioPic[0] &&
        fields.bioPic[0] instanceof File
      ) {
        // Delete old image if it exists
        if (member.bioPic) {
          try {
            await deleteImageFromFirebase(member.bioPic);
          } catch (imageError) {
            console.warn(
              'Failed to delete old image from Firebase:',
              imageError
            );
            // Continue with upload even if old image deletion fails
          }
        }

        // Upload new image
        const fileName = Date.now() + fields.bioPic[0].name;
        imageUrl = await uploadImageToFirebase(fields.bioPic[0], { fileName });
      }

      const socials = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'];
      for (const key of socials) {
        if (typeof fields[key] === 'undefined') {
          fields[key] = '';
        }
      }

      const memberId = member.id; // Prisma UUID id
      const updatedMember = {
        id: memberId,
        bioPic: imageUrl,
        name: fields.name,
        role: fields.role,
        facebook: normalizeUrl(fields.facebook),
        instagram: normalizeUrl(fields.instagram),
        tiktok: normalizeUrl(fields.tiktok),
        youtube: normalizeUrl(fields.youtube),
        x: normalizeUrl(fields.x),
      };

      await updateMemberService(memberId, updatedMember);
      onSuccess('Member updated successfully');
    } catch (error) {
      onError(error.message || 'Failed to update member');
    }
  };

  return (
    <EditItem
      item={member}
      editFields={editMemberFields}
      onEdit={onEdit}
      onClose={onClose}
      title='EDIT MEMBER'
    />
  );
};

export default EditMember;
