import './musicEdit.css';

import React, { useEffect } from 'react';
import AddPlayer from './AddPlayer';
import EditPlayer from './EditPlayer';
import DeletePlayer from './DeletePlayer';
import editPlayerFields from './editPlayerFields';
import { fetchPlayers } from '../../redux/actions';
import { connect } from 'react-redux';
import axios from 'axios';

const MusicEdit = ({ fetchPlayers, players }) => {
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const editPlayer = player => {
    const path = new URL(player.spotifyLink).pathname;
    const theme = player.bgColor ? player.bgColor : '';
    const embedLink = `https://open.spotify.com/embed${path}?utm_source=generator${theme}`;
    const updatedPlayer = { ...player, embedLink, bgColor: theme };
    console.log(updatedPlayer);
    axios
      .post('/api/updatePlayer', updatedPlayer)
      .then(res => fetchPlayers())
      .catch(err => console.log(err));
  };

  const deletePlayer = id => {
    axios
      .get(`/api/deletePlayer/${id}`)
      .then(res => fetchPlayers())
      .catch(err => console.log(err));
  };

  const renderPlayers = players.map(player => {
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
          <a
            href={player.spotifyLink}
            target='_blank'
            rel='no-referrer'
            className='btn btn-sm btn-light secondary-font'
          >
            Link to Spotify
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='20'
              height='20'
              viewBox='0 0 30 30'
            >
              <path d='M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z'></path>
            </svg>
          </a>
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
            onDelete={deletePlayer}
          />
        </div>
      </div>
    );
  });

  return (
    <>
      <div
        id='music-edit'
        className='row'
      >
        <h3>Edit Music</h3>
        <hr />
        <AddPlayer />
        <div
          id='currentPlayers'
          className='list-group'
        >
          {players.length > 0 ? (
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
  return { players: music };
}

export default connect(mapStateToProps, { fetchPlayers })(MusicEdit);
