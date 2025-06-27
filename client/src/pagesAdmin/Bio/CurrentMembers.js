import React, { useEffect } from 'react';
import axios from 'axios';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Bootstrap/Accordion';
import AddMember from './AddMember';
import editMemberFields from './editMemberFields';
import { Instagram } from './socialMediaIcons';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

function extractStoragePathFromUrl(url) {
  const match = url && url.match(/\/o\/([^?]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }
  return url ? url.split('/').pop().split('?')[0] : '';
}

const CurrentMembers = ({ fetchMembers, members }) => {
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const deleteMember = async id => {
    const memberToDelete = members.find(m => m._id === id);
    const imageUrl = memberToDelete && memberToDelete.bioPic;
    const imageName = extractStoragePathFromUrl(imageUrl);
    if (imageName) {
      try {
        await deleteImageFromFirebase(imageName);
      } catch (err) {
        console.log('Error deleting image from Firebase:', err);
      }
    }
    await axios.get(`/api/deleteMember/${id}`);
    fetchMembers();
  };

  const editFields = member => {
    return editMemberFields(member);
  };

  const editMember = async (_id, { bioPic, name, role, instaTag }) => {
    let newPhoto = bioPic ? bioPic[0] : '';
    const currentMember = members.find(m => m._id === _id);
    let oldImageUrl = currentMember ? currentMember.bioPic : '';
    let imageUrl = oldImageUrl;
    if (newPhoto && newPhoto instanceof File) {
      const oldImageName = extractStoragePathFromUrl(oldImageUrl);
      if (oldImageName) {
        try {
          await deleteImageFromFirebase(oldImageName);
        } catch (err) {
          console.log('Error deleting old image from Firebase:', err);
        }
      }
      try {
        const fileName = Date.now() + newPhoto.name;
        imageUrl = await uploadImageToFirebase(newPhoto, { fileName });
      } catch (err) {
        throw err;
      }
    }
    const updatedMember = {
      id: _id,
      bioPic: imageUrl,
      name,
      role,
      instaTag,
    };
    await axios.post(`/api/updateMember/${_id}`, updatedMember);
    fetchMembers();
  };

  const accordionItems = [];

  const createAccordionItems = () => {
    members.map((member, index) => {
      const { _id, bioPic, name, role, instaTag } = member;
      // Use the image URL directly
      const imgURL = bioPic || '';
      let parsedInsta = '';
      try {
        parsedInsta = new URL(instaTag).pathname.replace('/', '');
      } catch {
        parsedInsta = instaTag;
      }
      return accordionItems.push({
        data: member,
        group: 'members',
        id: _id,
        name,
        header: name,
        img: imgURL,
        subhead: role,
        content: [{ prefix: <Instagram />, value: parsedInsta }],
      });
    });
  };
  createAccordionItems();

  return (
    <div className='my-5'>
      <Accordion
        id='membersList'
        title='Members'
        items={accordionItems}
        editFields={editFields}
        onEdit={editMember}
        onDelete={deleteMember}
      />
      <div className='d-flex mb-5'>
        <AddMember />
      </div>
    </div>
  );
};

function mapStateToProps({ members }) {
  return { members };
}

export default connect(mapStateToProps, { fetchMembers })(CurrentMembers);
