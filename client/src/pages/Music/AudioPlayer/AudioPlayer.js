import cover from '../../../images/music/yesdevilgas.jpg';
import 'react-h5-audio-player/lib/styles.css';
import './AudioPlayer.css';

import React, { useState, createContext } from 'react';
import PlayerControls from 'react-h5-audio-player';
import TrackList from './TrackContent/TrackList';
import { trackInfo } from './TrackContent/trackInfo';

export const TrackContext = createContext();

const AudioPlayer = () => {


  const [trackIndex, setTrackIndex] = useState(0);

  const handleClickPrevious = () => {
    setTrackIndex((currentTrack) =>
      currentTrack === 0 ? trackInfo.length - 1 : currentTrack - 1
    );
  };

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < trackInfo.length - 1 ? currentTrack + 1 : 0
    );
  };



  return (
    <div id="audio-player" className="row justify-content-center">
      <div className="col-sm-10 col-md-6 col-12">
        <div>
          <img id="cover-img" src={cover} alt="album cover" />

          <PlayerControls
            src={trackInfo[trackIndex].src}
            showSkipControls={true}
            showJumpControls={false}
            onClickPrevious={handleClickPrevious}
            onClickNext={handleClickNext}
            layout='stacked-reverse'
          />
        </div>
        <div id="buttonsAccordion">
          <TrackContext.Provider value={{ trackIndex, setTrackIndex }} >
            <TrackList />
          </TrackContext.Provider>
        </div>
      </div>
    </div>
  );

};

export default AudioPlayer;