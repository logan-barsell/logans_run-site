import React, { useMemo } from 'react';
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

  // Define the form fields configuration
  const bandsintownFields = [
    {
      name: 'bandsintownArtist',
      type: 'text',
      label: 'Artist Name / ID',
      placeholder: 'Enter your Bandsintown artist name',
      required: false,
    },
  ];

  const handleSubmit = async values => {
    await dispatch(
      updateShowsSettings({
        showSystem,
        bandsintownArtist: values.bandsintownArtist || '',
      })
    );
  };

  const handleSuccess = () => {
    showSuccess('Bandsintown settings updated successfully');
  };

  const handleError = err => {
    showError(err.message || 'Failed to update Bandsintown settings');
  };

  // Get current settings data for initial values
  const initialValues = useMemo(
    () => ({
      bandsintownArtist: showsSettings?.bandsintownArtist || '',
    }),
    [showsSettings?.bandsintownArtist]
  );

  return (
    <>
      <EditableForm
        title='Bandsintown Settings'
        containerId='bandsintownEdit'
        fields={bandsintownFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      />

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
