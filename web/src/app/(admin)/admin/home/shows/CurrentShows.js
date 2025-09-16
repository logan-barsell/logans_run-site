'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchShows,
  fetchShowsSettings,
  updateShowsSettings,
} from '../../../../../redux/actions';
import '../../../../../app/(public)/media/Media.css';
import { DEFAULT_SHOW_SETTINGS } from './constants';
import CustomShowsManagement from './CustomShowsManagement';
import BandsintownManagement from './BandsintownManagement';
import { useAlert } from '../../../../../contexts/AlertContext';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';

const CurrentShows = () => {
  const dispatch = useDispatch();
  const shows = useSelector(state => state.shows?.data || []);
  const loading = useSelector(state => state.shows?.loading || false);
  const error = useSelector(state => state.shows?.error || null);
  const showsSettingsState = useSelector(state => state.showsSettings);
  const { showError, showSuccess } = useAlert();

  const showsSettings = React.useMemo(
    () => showsSettingsState?.data || DEFAULT_SHOW_SETTINGS,
    [showsSettingsState?.data]
  );
  const [showSystem, setShowSystem] = useState('custom');
  const isUpdating = useRef(false);
  const operationSuccessfulRef = useRef(false);

  useEffect(() => {
    dispatch(fetchShowsSettings());
  }, [dispatch]);

  useEffect(() => {
    if (showsSettings) {
      setShowSystem(showsSettings.showSystem || 'custom');
    }
  }, [showsSettings]);

  // Ensure we fetch fresh shows for admin when using custom management
  useEffect(() => {
    if (showSystem === 'custom') {
      dispatch(fetchShows());
    }
  }, [dispatch, showSystem]);

  const handleShowSystemChange = e => {
    const newSystem = e.target.value;
    isUpdating.current = true;
    setShowSystem(newSystem);
    dispatch(
      updateShowsSettings({
        showSystem: newSystem,
        bandsintownArtist: showsSettings.bandsintownArtist || '',
      })
    );
  };

  // Handle success/error alerts based on Redux state changes
  useEffect(() => {
    if (isUpdating.current && showsSettingsState?.loading === false) {
      if (showsSettingsState?.error) {
        showError(
          showsSettingsState?.error?.message || 'Failed to update show system'
        );
        setShowSystem(showsSettings?.showSystem || 'custom');
      } else if (showsSettingsState?.data) {
        showSuccess('Show system updated successfully');
      }
      isUpdating.current = false;
    }
  }, [showsSettingsState, showError, showSuccess, showsSettings.showSystem]);

  // Handle successful show operations
  const handleShowSuccess = message => {
    showSuccess(message);
    // Set a flag that we had a successful operation
    operationSuccessfulRef.current = true;
  };

  const handleShowError = error => {
    showError(error);
  };

  // Handle modal close - only refresh if operation was successful
  const handleModalClose = () => {
    if (operationSuccessfulRef.current) {
      dispatch(fetchShows());
      operationSuccessfulRef.current = false; // Reset flag
    }
  };

  return (
    <div className='mt-5 mb-5 pb-5'>
      <div className='selectCategory'>
        <select
          value={showSystem}
          onChange={handleShowSystemChange}
          className='form-select form-control form-select-md mb-3'
          aria-label='.form-select-lg example'
        >
          <option disabled>Select Shows System</option>
          <option value='custom'>Custom Management</option>
          <option value='bandsintown'>Bandsintown</option>
        </select>
      </div>
      <hr />
      {showSystem === 'bandsintown' ? (
        <BandsintownManagement
          showSystem={showSystem}
          showsSettings={showsSettings}
        />
      ) : loading ? (
        <LoadingSpinner
          size='lg'
          color='white'
          centered={true}
        />
      ) : error ? (
        <StaticAlert
          type={error.severity || 'danger'}
          title={error.title || 'Error'}
          description={error.message || error}
        />
      ) : (
        <CustomShowsManagement
          shows={shows}
          fetchShows={() => dispatch(fetchShows())}
          onSuccess={handleShowSuccess}
          onError={handleShowError}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default CurrentShows;
