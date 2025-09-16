import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({
  videoUrl,
  width = '100%',
  height = '100%',
  startTime = 0,
  endTime = null,
  active = true,
  poster,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If not active, pause and unload the source to save bandwidth
    if (!active) {
      try {
        video.pause();
        // Remove src to release network resources
        video.removeAttribute('src');
        video.load();
      } catch (_) {}
      return;
    }

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
  }, [active, startTime, endTime, videoUrl]);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      // Only set src when active to prevent background buffering
      {...(active && videoUrl ? { src: videoUrl } : {})}
      preload={active ? 'auto' : 'none'}
      autoPlay={active}
      loop
      muted
      playsInline
      {...(poster ? { poster } : {})}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: 'black',
      }}
    />
  );
};

export default VideoPlayer;
