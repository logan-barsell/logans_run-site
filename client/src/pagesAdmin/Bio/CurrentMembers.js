import React, { useEffect } from 'react';
import axios from 'axios';
import { fetchMembers } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Bootstrap/Accordion';
import AddMember from './AddMember';
import editMemberFields from './editMemberFields';
import { Instagram } from './socialMediaIcons';

const CurrentMembers = ({ fetchMembers, members }) => {

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);


  const deleteMember = id => {
    axios.get(`/api/deleteMember/${id}`).then(res => {
      fetchMembers();
      console.log('DELETED MEMBER', res);
    });
  };

  const editFields = member => {
    return editMemberFields(member);
  };

  const editMember = (_id, { bioPic, name, role, instaTag }) => {
    const newPhoto = bioPic ? bioPic[0] : '';

    const updatedMember = {
      id: _id,
      bioPic: newPhoto,
      name,
      role,
      instaTag
    };

    const payload = new FormData();
    for (let key in updatedMember) {
      if(updatedMember[key]) {
        payload.append(key, updatedMember[key]);
      }
    }

    axios.post(`/api/updateMember/${_id}`, payload).then(res => {
      fetchMembers();
    }).catch(err => console.log(err));

  }

  const accordionItems = [];

  const createAccordionItems = () => {
    members.map((member, index) => {
      const { _id, bioPic, name, role, instaTag } = member;
      const blob = new Blob([Int8Array.from(bioPic.img.image.data)], {type: bioPic.img.contentType});
      const imgURL = window.URL.createObjectURL(blob);
      const parsedInsta = new URL(instaTag).pathname.replace('/', '');
      return accordionItems.push({
        data: member,
        group: 'members',
        id: _id,
        name,
        header: name,
        img: imgURL,
        subhead: role,
        content: [
          { prefix: <Instagram />, value: parsedInsta }
        ]
      });
    });
  }
  createAccordionItems();

  return (
    <div className="my-5">
      <Accordion
        id="membersList"
        title="Members"
        items={accordionItems}
        editFields={editFields}
        onEdit={editMember}
        onDelete={deleteMember}
      />
      <div className="d-flex mb-5">
        <AddMember />
      </div>
    </div>
  );
}

function mapStateToProps({ members }) {
  return { members };
}

export default connect(mapStateToProps, { fetchMembers })(CurrentMembers);