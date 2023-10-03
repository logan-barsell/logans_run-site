import React from 'react';

import itunes from '../../../../images/music/itunes.png';


const Songs = ({ songs }) => {


  const renderedSongs = songs.map((song) => {
    return (
      <li key={song.title} className="list-group-item justify-content-between align-items-center">

        <div className="shit">

          <div className="song-title">{song.title}</div>
          <div>
            <audio controls controlsList="nodownload">
              <source src={song.audio} type="audio/mpeg" />               Your browser does not support the audio tag.
            </audio>
          </div>

          <div className="dropdown">
            <button className="badge badge-danger dropdown-toggle" id="song1dd" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Buy Song
            </button>
            <ul className="dropdown-menu" aria-labelledby="song1dd">
              <li>
                <a className="dropdown-item" href="#">
                  <img className="itunes" src={itunes} />
                </a>
              </li>
            </ul>
          </div>

        </div>

      </li>
    );
  });

  return renderedSongs;
};

export default Songs;