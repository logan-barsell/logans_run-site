import './musicEdit.css';

import React, { useEffect } from 'react';
import AddPlayer from './AddPlayer';
import EditPlayer from './EditPlayer';
import DeletePlayer from './DeletePlayer';
import { fetchPlayers } from '../../redux/actions';
import { connect } from 'react-redux';
import { PageTitle, Divider, NoContent } from '../../components/Header';
import {
  Spotify,
  AppleMusic,
  YouTube,
  SoundCloud,
} from '../../components/icons';

const MusicEdit = ({ fetchPlayers, players }) => {
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const renderPlayers = (players || []).map(player => {
    const dateString = new Date(player.date).toLocaleDateString();

    // Determine theme color based on bgColor value
    let color;
    let borderStyle;
    switch (player.bgColor) {
      case 'auto':
      case '':
        color = 'transparent'; // Transparent for auto theme
        borderStyle = '2px solid #666666'; // Outline for auto theme
        break;
      case '0':
        color = '#282828'; // Dark gray for dark theme
        borderStyle = 'none';
        break;
      case '1':
        color = '#FFFFFF'; // White for light theme
        borderStyle = 'none';
        break;
      default:
        color = 'transparent'; // Default to transparent
        borderStyle = '2px solid #666666';
    }
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
          <PageTitle
            as='h3'
            className='mb-0'
          >
            {player.title}
          </PageTitle>
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
            style={{ backgroundColor: `${color}`, border: `${borderStyle}` }}
          ></div>
        </p>

        <Divider />
        <div className='buttons d-flex justify-content-center'>
          <EditPlayer player={player} />
          <DeletePlayer player={player} />
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
        <PageTitle>Edit Music</PageTitle>
        <Divider />
        <AddPlayer />
        <div
          id='currentPlayers'
          className='list-group'
        >
          {players && players.length > 0 ? (
            renderPlayers
          ) : (
            <NoContent>No Music</NoContent>
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
