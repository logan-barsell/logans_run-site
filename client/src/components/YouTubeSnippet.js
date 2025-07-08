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
}) {
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    let intervalId = null;

    // create or re-create the YT.Player instance
    function initPlayer() {
      if (!iframeRef.current || !window.YT?.Player) return;
      // destroy any existing before re-init
      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(iframeRef.current, {
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
    ensureYouTubeAPI().then(() => {
      if (!isActive) return;
      initPlayer();
    });

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
      playerRef.current?.destroy();
    };
  }, [videoId, startTime, endTime]);

  // build the src URL including UI-hiding flags
  let src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1
       &autoplay=1
       &start=${startTime}${endTime != null ? `&end=${endTime}` : ''}&controls=0
       &rel=0
       &loop=1
       &playlist=${videoId}&modestbranding=1
       &disablekb=1
       &iv_load_policy=3
       &playsinline=1`.replace(/\s+/g, '');

  return (
    <iframe
      ref={iframeRef}
      title='Band Video Preview'
      width={width}
      height={height}
      src={src}
      allow='autoplay; encrypted-media'
      style={{
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}

export default YouTubeSnippet;
