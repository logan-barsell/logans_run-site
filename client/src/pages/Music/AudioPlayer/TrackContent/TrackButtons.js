import React from 'react';
import ModalContent from '../../../../components/Bootstrap/ModalContent';

const TrackButtons = ({ track, collapseId, headingId }) => {
  const lyricsModalId = `lyrics${track.id}`;
  const getSongModalId = `getSong${track.id}`;
  const creditsModalId = `credits${track.id}`;
  return (
    <div
      id={collapseId}
      className='show accordion-collapse collapse row justify-content-center'
      aria-labelledby={headingId}
      data-bs-parent="#buttonsAccordion"
    >

      <div className="col-12 col-sm-4 d-grid gap-2">
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          data-bs-toggle="modal"
          data-bs-target={`#${lyricsModalId}`}
        >
          Lyrics
        </button>
        <ModalContent modalId={lyricsModalId} track={track} />
      </div>

      <div className="col-12 col-sm-4 d-grid gap-2">
        <button
          type="button"
          className="btn btn-danger btn-sm"
          data-bs-toggle="modal"
          data-bs-target={`#${getSongModalId}`}
        >
          Get Song
        </button>
        <ModalContent modalId={getSongModalId} track={track} />
      </div>

      <div className="col-12 col-sm-4 d-grid gap-2">
        <button
          type="button"
          className="btn btn-outline-light btn-sm"
          data-bs-toggle="modal"
          data-bs-target={`#${creditsModalId}`}
        >Credits
        </button>
        <ModalContent modalId={creditsModalId} track={track} />
      </div>

    </div>
  );
};

export default TrackButtons;