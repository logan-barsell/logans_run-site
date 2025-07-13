import React from 'react';
import { useDispatch } from 'react-redux';
import { updateShowsSettings } from '../../../redux/actions';
import { EditableForm } from '../../../components/Forms';
import {
  BandsintownWidget,
  BandsintownSetupGuide,
} from '../../../components/Bandsintown';
import { useAlert } from '../../../contexts/AlertContext';

const BandsintownManagement = ({ showSystem, showsSettings }) => {
  const dispatch = useDispatch();
  const { showError, showSuccess } = useAlert();

  const handleSaveBandsintown = data => {
    dispatch(
      updateShowsSettings({
        showSystem,
        bandsintownArtist: data.bandsintownArtist || '',
      })
    );
  };

  const handleBandsintownSuccess = () => {
    showSuccess('Bandsintown settings updated successfully!');
  };

  const handleBandsintownError = err => {
    showError(err.message || 'Failed to update Bandsintown settings');
  };

  // Custom comparison function for bandsintown settings
  const compareBandsintownFunction = (initial, current) => {
    if (!initial || !current) return false;
    const initialArtist = initial.bandsintownArtist || '';
    const currentArtist = current.bandsintownArtist || '';
    return initialArtist === currentArtist;
  };

  return (
    <>
      <EditableForm
        title='Bandsintown Settings'
        containerId='bandsintownEdit'
        initialData={showsSettings}
        onSave={handleSaveBandsintown}
        onSuccess={handleBandsintownSuccess}
        onError={handleBandsintownError}
        compareFunction={compareBandsintownFunction}
      >
        {({ formData, handleInputChange }) => (
          <div className='mb-sm-3 mb-2'>
            <label
              htmlFor='bandsintownArtist'
              className='form-label'
            >
              Artist Name / ID
            </label>
            <input
              id='bandsintownArtist'
              name='bandsintownArtist'
              className='form-control mb-3'
              type='text'
              value={formData.bandsintownArtist || ''}
              onChange={handleInputChange}
              placeholder='Enter your Bandsintown artist name'
              autoComplete='off'
            />
          </div>
        )}
      </EditableForm>

      {/* BandsintownWidget and SetupGuide outside the form */}
      {showsSettings?.bandsintownArtist && (
        <div className='my-4 pb-4'>
          <BandsintownWidget artistName={showsSettings.bandsintownArtist} />
        </div>
      )}
      <div className='mt-4'>
        <BandsintownSetupGuide />
      </div>
    </>
  );
};

export default BandsintownManagement;
