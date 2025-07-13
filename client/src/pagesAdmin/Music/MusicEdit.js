import './musicEdit.css';

import React, { useEffect } from 'react';
import AddPlayer from './AddPlayer';
import EditPlayer from './EditPlayer';
import DeletePlayer from './DeletePlayer';
import editPlayerFields from './editPlayerFields';
import { fetchPlayers } from '../../redux/actions';
import { connect } from 'react-redux';
import { updatePlayer, deletePlayer } from '../../services/musicPlayersService';
import {
  Spotify,
  AppleMusic,
  YouTube,
  SoundCloud,
} from '../../components/icons';
import { useAlert } from '../../contexts/AlertContext';
import {
  validateSpotifyUrl,
  generateSpotifyEmbedUrl,
} from '../../utils/spotifyValidation';

const MusicEdit = ({ fetchPlayers, players }) => {
  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const editPlayer = async player => {
    try {
      // Validate Spotify URL
      const spotifyValidation = validateSpotifyUrl(player.spotifyLink);
      if (!spotifyValidation.isValid) {
        showError(spotifyValidation.error);
        return;
      }

      // Generate embed URL
      const embedLink = generateSpotifyEmbedUrl(
        player.spotifyLink,
        player.bgColor
      );
      if (!embedLink) {
        showError('Failed to generate Spotify embed URL');
        return;
      }

      const updatedPlayer = { ...player, embedLink };

      await updatePlayer(updatedPlayer);
      fetchPlayers();
      showSuccess('Music player updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update music player');
    }
  };

  const handleDeletePlayer = async id => {
    try {
      await deletePlayer(id);
      fetchPlayers();
      showSuccess('Music player deleted successfully!');
    } catch (err) {
      showError(err.message || 'Failed to delete music player');
    }
  };

  const renderPlayers = (players || []).map(player => {
    const dateString = new Date(player.date).toLocaleDateString();
    const color = !player.bgColor ? '#e81d10' : '#282828';
    return (
      <div
        key={player._id}
        className='list-group-item list-group-item-action'
        aria-current='true'
      >
        <div className='d-flex w-100 justify-content-sm-end justify-content-center mb-md-3'>
          <p className='released'>
            Released
            <span className='secondary-font'>{dateString}</span>
          </p>
        </div>

        <div className='d-flex w-100 justify-content-center mb-md-2'>
          <h3>{player.title}</h3>
        </div>

        <p className='mb-4 d-flex justify-content-center'>
          <div className='music-platform-links d-flex gap-2'>
            {player.spotifyLink && (
              <a
                href={player.spotifyLink}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
                title='Spotify'
              >
                <Spotify />
              </a>
            )}
            {player.appleMusicLink && (
              <a
                href={player.appleMusicLink}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
                title='Apple Music'
              >
                <AppleMusic />
              </a>
            )}
            {player.youtubeLink && (
              <a
                href={player.youtubeLink}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
                title='YouTube'
              >
                <YouTube />
              </a>
            )}
            {player.soundcloudLink && (
              <a
                href={player.soundcloudLink}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
                title='SoundCloud'
              >
                <SoundCloud />
              </a>
            )}
          </div>
        </p>

        <p className='d-flex justify-content-center align-items-center mb-2 mb-md-3'>
          <span>Theme </span> &nbsp;
          <div
            className='theme'
            style={{ backgroundColor: `${color}` }}
          ></div>
        </p>

        <hr />
        <div className='buttons d-flex justify-content-center'>
          <EditPlayer
            player={player}
            editFields={editPlayerFields}
            onEdit={editPlayer}
          />
          <DeletePlayer
            player={player}
            onDelete={handleDeletePlayer}
          />
        </div>
      </div>
    );
  });

  return (
    <>
      <div
        id='music-edit'
        className='row mb-5 pb-5'
      >
        <h3>Edit Music</h3>
        <hr />
        <AddPlayer />
        <div
          id='currentPlayers'
          className='list-group'
        >
          {players && players.length > 0 ? (
            renderPlayers
          ) : (
            <h3 className='no-content'>No Music</h3>
          )}
        </div>
      </div>
    </>
  );
};

function mapStateToProps({ music }) {
  return { players: music?.data || [] };
}

export default connect(mapStateToProps, { fetchPlayers })(MusicEdit);
