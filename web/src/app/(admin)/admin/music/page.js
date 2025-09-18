'use client';

import './musicEdit.css';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddPlayer from './AddPlayer';
import EditPlayer from './EditPlayer';
import DeletePlayer from './DeletePlayer';
import { fetchPlayers } from '../../../../redux/actions';
import { PageTitle, Divider, NoContent } from '../../../../components/Header';
import { useTheme } from '../../../../contexts/ThemeContext';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import StaticAlert from '../../../../components/Alert/StaticAlert';
import {
  Spotify,
  AppleMusic,
  YouTube,
  SoundCloud,
} from '../../../../components/icons';

export default function MusicEditPage() {
  const dispatch = useDispatch();
  const players = useSelector(state => state.music?.data || []);
  const loading = useSelector(state => state.music?.loading || false);
  const error = useSelector(state => state.music?.error || null);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [dispatch]);

  const renderPlayers = (players || []).map(player => {
    const dateString = new Date(player.date).toLocaleDateString();

    // Determine theme color based on bgColor value
    let color;
    let borderStyle;
    switch (player.bgColor) {
      case 'AUTO':
        color = 'transparent'; // Transparent for auto theme
        borderStyle = '2px solid #666666'; // Outline for auto theme
        break;
      case 'DARK':
        color = '#282828'; // Dark gray for dark theme
        borderStyle = 'none';
        break;
      case 'LIGHT':
        color = '#FFFFFF'; // White for light theme
        borderStyle = 'none';
        break;
      default:
        color = 'transparent'; // Default to transparent
        borderStyle = '2px solid #666666';
    }
    return (
      <div
        key={player.id}
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
            as='h4'
            className='mb-3'
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
                <Spotify style={theme?.socialMediaIconStyle || 'DEFAULT'} />
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
                <AppleMusic style={theme?.socialMediaIconStyle || 'DEFAULT'} />
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
                <YouTube style={theme?.socialMediaIconStyle || 'DEFAULT'} />
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
                <SoundCloud style={theme?.socialMediaIconStyle || 'DEFAULT'} />
              </a>
            )}
          </div>
        </p>

        <div className='d-flex justify-content-center align-items-center mb-2 mb-md-3'>
          <span>Theme </span> &nbsp;
          <div
            className='theme'
            style={{ backgroundColor: `${color}`, border: `${borderStyle}` }}
          ></div>
        </div>

        <Divider className='w-75 mx-auto' />
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
        <PageTitle divider>Edit Music</PageTitle>
        <AddPlayer />

        {loading ? (
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
          <div
            id='currentPlayers'
            className='list-group'
          >
            {players && players.length > 0 ? (
              renderPlayers
            ) : (
              <div className='my-4'>
                <NoContent>No Music</NoContent>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
