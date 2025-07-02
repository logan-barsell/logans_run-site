import React, { useEffect } from 'react';
import axios from 'axios';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Bootstrap/Accordion';
import AddMember from './AddMember';
import editMemberFields from './editMemberFields';
import {
  Facebook,
  Instagram,
  TikTok,
  YouTube,
  X as XIcon,
} from './socialMediaIcons';
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

  const editMember = async (
    _id,
    { bioPic, name, role, facebook, instagram, tiktok, youtube, x }
  ) => {
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
      facebook,
      instagram,
      tiktok,
      youtube,
      x,
    };
    await axios.post(`/api/updateMember/${_id}`, updatedMember);
    fetchMembers();
  };

  const accordionItems = [];

  const renderSocialIcons = member => {
    const icons = [];
    if (member.facebook)
      icons.push(
        <a
          key='facebook'
          href={member.facebook}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Facebook />{' '}
        </a>
      );
    if (member.instagram)
      icons.push(
        <a
          key='instagram'
          href={member.instagram}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Instagram />{' '}
        </a>
      );
    if (member.tiktok)
      icons.push(
        <a
          key='tiktok'
          href={member.tiktok}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <TikTok />{' '}
        </a>
      );
    if (member.youtube)
      icons.push(
        <a
          key='youtube'
          href={member.youtube}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <YouTube />{' '}
        </a>
      );
    if (member.x)
      icons.push(
        <a
          key='x'
          href={member.x}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <XIcon />{' '}
        </a>
      );
    if (!icons.length) return null;
    return (
      <div className='member-social-icons d-flex justify-content-center mb-2'>
        {icons}
      </div>
    );
  };

  const createAccordionItems = () => {
    members.map((member, index) => {
      const {
        _id,
        bioPic,
        name,
        role,
        facebook,
        instagram,
        tiktok,
        youtube,
        x,
      } = member;
      // Use the image URL directly
      const imgURL = bioPic || '';
      const socials = renderSocialIcons(member);
      return accordionItems.push({
        data: member,
        group: 'members',
        id: _id,
        name,
        header: name,
        img: imgURL,
        subhead: role,
        content: [
          {
            prefix: 'Member Socials',
            value: socials || (
              <>
                <br />
                No Socials
              </>
            ),
          },
        ],
      });
    });
  };
  createAccordionItems();

  return (
    <div className='my-5 mb-8'>
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
