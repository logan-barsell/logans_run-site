import React from 'react';
import EditItem from '../../components/Modifiers/EditItem';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';
import { useAlert } from '../../contexts/AlertContext';
import editMemberFields from './editMemberFields';
import normalizeUrl from '../../utils/normalizeUrl';
import { updateMember as updateMemberService } from '../../services/membersService';

const EditMember = ({ member, fetchMembers }) => {
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
    try {
      let imageUrl = member.bioPic || '';

      if (fields.bioPic && fields.bioPic[0]) {
        if (member.bioPic) {
          try {
            await deleteImageFromFirebase(member.bioPic);
          } catch (err) {
            console.log('Error deleting old image from Firebase:', err);
          }
        }
        const fileName = Date.now() + fields.bioPic[0].name;
        imageUrl = await uploadImageToFirebase(fields.bioPic[0], { fileName });
      }

      const socials = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'];
      for (const key of socials) {
        if (typeof fields[key] === 'undefined') {
          fields[key] = '';
        }
      }

      const updatedMember = {
        id: member._id,
        bioPic: imageUrl,
        name: fields.name,
        role: fields.role,
        facebook: normalizeUrl(fields.facebook),
        instagram: normalizeUrl(fields.instagram),
        tiktok: normalizeUrl(fields.tiktok),
        youtube: normalizeUrl(fields.youtube),
        x: normalizeUrl(fields.x),
      };

      await updateMemberService(member._id, updatedMember);
      showSuccess('Member updated successfully');
      fetchMembers();
    } catch (_error) {
      showError('Failed to update member');
    }
  };

  return (
    <EditItem
      item={member}
      editFields={editMemberFields}
      onEdit={onEdit}
      title='EDIT MEMBER'
    />
  );
};

export default EditMember;
