import './Credits.css';
import React from 'react';

const SongCredits = ({ backUpVocals }) => {
  return (
    <div className="credits">
      <div>
        <h5>Vocals</h5>
        <p>Logan Barsell</p>
      </div>
      <hr />
      <div>
        <h5>Lead Guitar</h5>
        <p>Matt Abbott</p>
      </div>
      <hr />
      <div>
        <h5>Drums</h5>
        <p>Eyan Stran</p>
      </div>
      <hr />
      <div>
        <h5>Rhythm Guitar</h5>
        <p>Logan Barsell</p>
      </div>
      <hr />
      <div>
        <h5>Bass</h5>
        <p>Nick Abbott</p>
      </div>
    </div>
  );
};

export default SongCredits;