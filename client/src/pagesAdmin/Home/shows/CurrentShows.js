import React, { useEffect, useState, useRef } from 'react';
import {
  fetchShows,
  fetchShowsSettings,
  updateShowsSettings,
} from '../../../redux/actions';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_SHOW_SETTINGS } from './constants';
import CustomShowsManagement from './CustomShowsManagement';
import BandsintownManagement from './BandsintownManagement';
import { useAlert } from '../../../contexts/AlertContext';

const CurrentShows = ({ fetchShows, shows }) => {
  const { showError, showSuccess } = useAlert();
  const dispatch = useDispatch();
  const showsSettingsState = useSelector(state => state.showsSettings);
  const showsSettings = React.useMemo(
    () => showsSettingsState?.data || DEFAULT_SHOW_SETTINGS,
    [showsSettingsState?.data]
  );
  const [showSystem, setShowSystem] = useState('custom');
  const isUpdating = useRef(false);

  useEffect(() => {
    dispatch(fetchShowsSettings());
  }, [dispatch]);

  useEffect(() => {
    if (showsSettings) {
      setShowSystem(showsSettings.showSystem || 'custom');
    }
  }, [showsSettings]);

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
      ) : (
        <CustomShowsManagement
          shows={shows}
          fetchShows={fetchShows}
        />
      )}
    </div>
  );
};

function mapStateToProps({ shows }) {
  return { shows: shows?.data || [] };
}

export default connect(mapStateToProps, { fetchShows })(CurrentShows);
