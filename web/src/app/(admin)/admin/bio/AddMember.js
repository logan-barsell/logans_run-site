'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import ModalForm from '../../../../components/Forms/ModalForm';
import BaseModal from '../../../../components/Modals/BaseModal';
import { uploadImageToFirebase } from '../../../../lib/firebase';
import { addMember } from '../../../../services/membersService';
import { normalizeUrl } from '../../../../lib/strings';
import { PlusSquareFill } from '../../../../components/icons';
import Button from '../../../../components/Button/Button.jsx';
import { addMemberFields } from './constants';

const AddMember = ({ onSuccess, onError, onClose }) => {
  const [uploading, setUploading] = React.useState(false);
  const { user } = useSelector(state => state.auth);
  const tenantId = user?.tenantId;

  const onSubmit = async values => {
    try {
      setUploading(true);
      let imageUrl = '';
      let fileName = '';
      if (values.bioPic && values.bioPic.length) {
        try {
          fileName = Date.now() + values.bioPic[0].name;
          imageUrl = await uploadImageToFirebase(values.bioPic[0], {
            fileName,
            tenantId,
          });
        } catch (err) {
          setUploading(false);
          throw err;
        }
      }
      // Ensure all social fields are present and normalize URLs
      const socials = ['facebook', 'instagram', 'tiktok', 'youtube', 'x'];
      for (const key of socials) {
        if (typeof values[key] === 'undefined') {
          values[key] = '';
        }
      }
      const newMember = {
        bioPic: imageUrl,
        name: values.name,
        role: values.role,
        facebook: normalizeUrl(values.facebook),
        instagram: normalizeUrl(values.instagram),
        tiktok: normalizeUrl(values.tiktok),
        youtube: normalizeUrl(values.youtube),
        x: normalizeUrl(values.x),
      };
      await addMember(newMember);
      onSuccess('Member added successfully');
      setUploading(false);
    } catch (error) {
      onError('Failed to add member');
      setUploading(false);
    }
  };

  return (
    <BaseModal
      id='add_member_modal'
      title='NEW MEMBER'
      trigger={
        <Button
          className='addButton'
          variant='danger'
          type='button'
          disabled={uploading}
          loading={uploading}
          icon={<PlusSquareFill />}
          iconPosition='left'
        >
          {uploading ? 'Adding...' : 'Add Member'}
        </Button>
      }
      onClose={onClose}
    >
      <ModalForm
        fields={addMemberFields}
        onSubmit={onSubmit}
        resetMode='initial'
      />
    </BaseModal>
  );
};

export default AddMember;
