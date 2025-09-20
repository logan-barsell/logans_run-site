import React, { useEffect, useRef } from 'react';

// ————————————————
// GLOBAL YouTube API LOADER
// ————————————————
let ytApiReadyPromise = null;
function ensureYouTubeAPI() {
  if (!ytApiReadyPromise) {
    ytApiReadyPromise = new Promise(resolve => {
      // already loaded?
      if (window.YT && window.YT.Player) {
        return resolve();
      }
      // otherwise hook the callback
      window.onYouTubeIframeAPIReady = () => resolve();
      // inject the script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });
  }
  return ytApiReadyPromise;
}

// ————————————————
// YouTubeSnippet COMPONENT
// ————————————————
function YouTubeSnippet({
  videoId,
  width = '100%',
  height = '100%',
  startTime = 0,
  endTime = null,
  active = true,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    let intervalId = null;
    const container = containerRef.current;

    // create or re-create the YT.Player instance
    function initPlayer() {
      if (!active) return;
      if (!container || !window.YT?.Player) return;
      // destroy any existing before re-init
      playerRef.current?.destroy();
      // ensure container is empty before creating a new player
      try {
        container.innerHTML = '';
      } catch (_) {}

      playerRef.current = new window.YT.Player(container, {
        videoId,
        playerVars: {
          start: startTime,
          ...(endTime != null ? { end: endTime } : {}),
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          loop: 1,
          playlist: videoId,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: e => {
            e.target.mute();
            if (startTime) {
              e.target.seekTo(startTime, true);
            }
            e.target.playVideo();
          },
          onStateChange: e => {
            // Custom segment looping
            if (endTime != null && e.data === window.YT.PlayerState.PLAYING) {
              if (intervalId) clearInterval(intervalId);
              intervalId = setInterval(() => {
                if (
                  !playerRef.current ||
                  typeof playerRef.current.getCurrentTime !== 'function'
                )
                  return;
                const current = playerRef.current.getCurrentTime();
                if (current >= endTime - 0.1) {
                  // small buffer for timing
                  playerRef.current.seekTo(startTime || 0, true);
                }
              }, 200);
            } else if (e.data !== window.YT.PlayerState.PLAYING && intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          },
        },
      });
    }

    // wait for the API, then init
    if (active) {
      ensureYouTubeAPI().then(() => {
        if (!isActive) return;
        initPlayer();
      });
    } else {
      // When becoming inactive, destroy and clear container to avoid blank re-mounts
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }
      try {
        if (container) {
          container.innerHTML = '';
        }
      } catch (_) {}
    }

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
      // On unmount, destroy to stop buffering in background and clear container
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }
      try {
        if (container) {
          container.innerHTML = '';
        }
      } catch (_) {}
    };
  }, [videoId, startTime, endTime, active]);

  return (
    <div
      ref={containerRef}
      title='Band Video Preview'
      style={{
        width,
        height,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: 'black',
      }}
    />
  );
}

export default YouTubeSnippet;
