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
    const updatedPlayer = {...player, embedLink, bgColor: theme};
    console.log(updatedPlayer);
    axios.post('/api/updatePlayer', updatedPlayer)
      .then(res => fetchPlayers())
      .catch(err => console.log(err));
  };

  const deletePlayer = id => {
    axios.get(`/api/deletePlayer/${id}`)
      .then(res => fetchPlayers())
      .catch(err => console.log(err));
  }

  const renderPlayers = players.map(player => {
    const dateString = new Date(player.date).toLocaleDateString();
    const color = !player.bgColor ? '#e81d10' : '#282828'
    return (
      <div key={player._id} className="list-group-item list-group-item-action" aria-current="true">
        <div className="d-flex w-100 justify-content-end">
          <small><span>Released: </span>{dateString}</small>
        </div>
        <div className="d-flex w-100 justify-content-center">
          <h5 className="mb-2">{player.title}</h5>
        </div>
        <p className="mb-3 d-flex justify-content-center">
          <a href={player.spotifyLink} target="_blank" rel="no-referrer" className="btn btn-sm btn-light">Link to Spotify</a>
        </p>
        <small className="d-flex justify-content-center align-items-center mb-2">
          <span>Theme: </span> &nbsp; 
          <div className="theme" style={{ 'backgroundColor': `${color}`}}>
          </div>
        </small>
        <hr/>
        <div className="buttons d-flex justify-content-center">
          <EditPlayer player={player} editFields={editPlayerFields} onEdit={editPlayer}/>
          <DeletePlayer player={player}  onDelete={deletePlayer}/>
        </div>
      </div>
    );
  })

  return (
    <>
      <div id="music-edit" className="row">
        <h3>Edit Music</h3>
        <hr/>
        <AddPlayer/>
        <div id="currentPlayers" className="list-group">
          {
            renderPlayers
          }
        </div>
      </div>

    </>
  );
}

function mapStateToProps({ music }) {
  return { players: music };
}

export default connect(mapStateToProps, { fetchPlayers })(MusicEdit);