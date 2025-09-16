import React from 'react';
import './videoContainer.css';

// Option 1: Accepts children (for full flexibility)
const VideoContainer = ({ children }) => {
  return <div className='currentVideos'>{children}</div>;
};

// Option 2: Accepts videos and renderVideo (for convenience)
// const VideoContainer = ({ videos, renderVideo }) => (
//   <div className="currentVideos">
//     {videos.map(renderVideo)}
//   </div>
// );

export default VideoContainer;
