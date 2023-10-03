import React, { useState } from 'react';

const Lyrics = ({ songs }) => {

  const [activeSong, setActiveSong] = useState(0);

  const songSelection = songs.map((song, index) => {
    const active = index === activeSong ? 'active' : '';

    return(
      <li key={index} className="nav-item">
        <a 
          href="#!" 
          className={`nav-link ${active}`}
          onClick={() => setActiveSong(index)}
        >
          {song.title}
        </a>
      </li>
    );
  });

  const renderedLyrics = songs.map((song, index) => {
    const visible = index === activeSong ? 'visible' : 'visually-hidden';
    return (
      <li key={index} className={`list-group-item ${visible}`} style={{ whiteSpace: 'pre-line' }}>
        <h5>{song.title}</h5>
        {song.lyrics}
      </li>
    );
  });

  return (
    <>
      <ul className="nav justify-content-center">
        {songSelection}
      </ul>
      {renderedLyrics}
    </>
  );
};

export default Lyrics;