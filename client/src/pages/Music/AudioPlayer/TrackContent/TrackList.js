import React from 'react';
import { trackInfo } from './trackInfo';
import TrackListItem from './TrackListItem';


const TrackList = () => {

  const renderTracks = trackInfo.map(track => {

    return (
      <TrackListItem key={track.id} track={track} />
    );
  });
  return (
    <>
      {renderTracks}
    </>
  );
};

export default TrackList;