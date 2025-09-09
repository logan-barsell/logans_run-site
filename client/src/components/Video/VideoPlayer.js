import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({
  videoUrl,
  width = '100%',
  height = '100%',
  startTime = 0,
  endTime = null,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set start time
    if (startTime) {
      video.currentTime = startTime;
    }

    // Handle end time looping
    const handleTimeUpdate = () => {
      if (endTime != null && video.currentTime >= endTime - 0.1) {
        video.currentTime = startTime || 0;
      }
    };

    // Handle autoplay and mute
    const handleLoadedData = () => {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay failed, which is expected in some browsers
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [startTime, endTime]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      src={videoUrl}
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
};

export default VideoPlayer;
