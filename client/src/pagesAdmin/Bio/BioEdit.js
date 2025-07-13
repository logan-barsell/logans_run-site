import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchBio } from '../../redux/actions';
import { updateBio } from '../../services/bioService';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentMembers from './CurrentMembers';
import { useAlert } from '../../contexts/AlertContext';
import { EditableForm } from '../../components/Forms';

const BioEdit = ({ fetchBio, bio }) => {
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchBio();
  }, [fetchBio]);

  const handleSave = async data => {
    await updateBio({ data: data.text });
  };

  const handleSuccess = () => {
    showSuccess('Bio updated successfully');
    fetchBio();
  };

  const handleError = () => {
    showError('Failed to update bio');
  };

  // Custom comparison function for bio text
  const compareFunction = (initial, current) => {
    if (!initial || !current) return false;
    const initialText = initial.text || '';
    const currentText = current.text || '';
    return initialText === currentText;
  };

  return (
    <div className='mb-5 pb-5'>
      <EditableForm
        title='Update Bio'
        containerId='bioEdit'
        className='bio-form'
        initialData={bio && bio.length > 0 ? bio[0] : null}
        onSave={handleSave}
        onSuccess={handleSuccess}
        onError={handleError}
        compareFunction={compareFunction}
      >
        {({ formData, handleInputChange }) => (
          <div className='mb-3'>
            <textarea
              name='text'
              defaultValue={formData.text || ''}
              onChange={handleInputChange}
              required
              className='form-control'
              id='bioText'
            />
          </div>
        )}
      </EditableForm>
      <SecondaryNav label={'Members'} />
      <div className='container'>
        <div className='row'>
          <CurrentMembers />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps({ currentBio, members }) {
  return {
    bio: currentBio?.data || [],
    members: members?.data || [],
  };
}

export default connect(mapStateToProps, { fetchBio })(BioEdit);
