import React from 'react';
import './videoItem.css';

function getYouTubeId(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes('youtube.com')) {
      return new URLSearchParams(parsed.search).get('v');
    }
  } catch {
    // fallback: maybe it's already an ID
    return url;
  }
  return '';
}

const VideoItem = ({
  videoId,
  youtubeLink,
  title,
  description,
  startTime,
  endTime,
  iframe,
  children,
}) => {
  // Determine the embed URL
  let embedUrl = '';
  if (iframe) {
    const id = getYouTubeId(youtubeLink);
    embedUrl = id ? `https://www.youtube.com/embed/${id}` : '';
    if (startTime) embedUrl += `?start=${startTime}`;
    if (endTime) embedUrl += `${startTime ? '&' : '?'}end=${endTime}`;
  } else if (videoId) {
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
    if (startTime) embedUrl += `?start=${startTime}`;
    if (endTime) embedUrl += `${startTime ? '&' : '?'}end=${endTime}`;
  }

  return (
    <div className='vid-container'>
      <div className='video embed-responsive embed-responsive-16by9 mb-2'>
        <iframe
          title={title}
          className='embed-responsive-item'
          src={embedUrl}
          allow='autoplay; encrypted-media'
          width='100%'
          height='100%'
        ></iframe>
      </div>
      <div className='mb-2'>
        <div className='video-title'>{title}</div>
        <div className='video-desc'>{description}</div>
      </div>
      <div className='buttons d-grid gap-1'>{children}</div>
    </div>
  );
};

export default VideoItem;
