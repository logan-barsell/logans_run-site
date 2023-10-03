import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchMembers } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';

const AddMember = ({ fetchMembers }) => {

  const txtFields = [
    {
      label: 'Upload Image',
      name: 'bioPic',
      type: 'image'
    },
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Role', name: 'role', type: 'text' },
    { label: 'Instagram Tag', name: 'instaTag', type: 'text' }
  ];

  const onSubmit = ({ bioPic, name, role, instaTag }) => {

    const newMember = {
      bioPic: bioPic[0],
      name,
      role,
      instaTag
    };

    const payload = new FormData();
    for (let key in newMember) {
      payload.append(key, newMember[key]);
    }

    axios.post('/api/addMember', payload).then(res => {
      fetchMembers();
    });
  }

  const modalProps = {
    id: 'add_modal',
    label: 'add_label',
    title: 'NEW MEMBER',
    buttonText: 'Add Member'
  }


  const AddButton = () => {
    return (
      <button
        data-bs-toggle="modal"
        data-bs-target={`#${modalProps.id}`}
        className="addButton btn btn-danger"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
        </svg>
        {modalProps.buttonText}
      </button>
    );
  };

  return (
    <>
      <CustomModal modalProps={modalProps} modalButton={<AddButton />}>
        <ModalForm fields={txtFields} onSubmit={onSubmit} />
      </CustomModal>
    </>
  );

}

function mapStateToProps({ members }) {
  return { members };
}

export default connect(mapStateToProps, { fetchMembers })(AddMember);