import React, { useState, useEffect, useContext } from 'react';
import { Collapse } from 'bootstrap';
import { TrackContext } from '../AudioPlayer';
import TrackButtons from './TrackButtons';

const TrackListItem = ({ track }) => {

  const { trackIndex, setTrackIndex } = useContext(TrackContext);

  const active = trackIndex === track.id;
  const activeClass = active ? 'active' : '';
  const evenStyles = (track.id % 2) === 1 ? 'even' : '';
  const headingId = `heading${track.id}`;
  const collapseId = `collapse${track.id}`;

  var [toggle, setToggle] = useState(false);

  useEffect(() => {
    var myCollapse = document.getElementById(`${collapseId}`);
    var bsCollapse = new Collapse(myCollapse, { toggle: false });
    trackIndex === track.id && toggle ? bsCollapse.show() : bsCollapse.hide()
  });

  useEffect(() => {
    trackIndex === track.id && setToggle(toggle => !toggle);
  }, [trackIndex, track.id]);

  const onClickFunc = () => {
    setTrackIndex(track.id);
  };

  return (
    <>
      <div
        id={headingId}
        key={track.id}
        className={`${activeClass} ${evenStyles} song row justify-content-between align-items-center`}
        onClick={() => onClickFunc()}
        data-bs-toggle="collapse"
        data-bs-target={collapseId}
        aria-expanded={active}
        aria-controls={collapseId}
      >
        <div className="col-auto align-self-center">
          <span>
            {track.name}
          </span>
        </div>
        <div className="col-auto align-self-center">
          <span>
            {track.time}
          </span>
        </div>
      </div>

      <TrackButtons track={track} collapseId={collapseId} headingId={headingId} />
    </>
  );
};

export default TrackListItem;