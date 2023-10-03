import spotify from '../../images/music/spotify.png';
import appleMusic from '../../images/music/applemusic.png';

import React from 'react';
import SongCredits from '../../pages/Music/AudioPlayer/TrackContent/SongCredits';

const ModalContent = ({ modalId, track }) => {
  const lyrics = modalId.includes('lyrics');
  const getSong = modalId.includes('getSong');
  const credits = modalId.includes('credits');
  return (
    <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}label`} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}label`}>{track.name}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="whitesmoke" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
              </svg>
            </button>
          </div>
          <div className="modal-body" style={{ whiteSpace: 'pre-line' }}>
            {lyrics && track.lyrics}
            {getSong &&
              <div className="getSongButtons">
                <a href={track.spotify} target="_blank" rel="noreferrer">
                  <img className="spotify" src={spotify} alt="" />
                </a>
                <hr />
                <a href="#!" target="_blank">
                  <img className="appleMusic" src={appleMusic} alt="" />
                </a>
              </div>
            }
            {credits && <SongCredits />}
          </div>
          <div className="modal-footer justify-content-center">
            <div className="col-6 d-grid gap-2">
              <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContent;