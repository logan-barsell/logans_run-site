import React from 'react';

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

const Video = ({ video }) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daySuffix = day => {
    const lastDigit = Number(day.toString()[day.toString().length - 1]);
    if (lastDigit === 1 && lastDigit !== 11) {
      return 'st';
    }
    if (lastDigit === 2 && lastDigit !== 12) {
      return 'nd';
    }
    if (lastDigit === 3 && lastDigit !== 13) {
      return 'rd';
    }
    return 'th';
  };

  const date = new Date(video.date);
  const month = months[date.getMonth()];
  const day = String(date.getDate());
  const year = String(date.getFullYear());
  const dateFormatted = `${month} ${day}${daySuffix(day)}, ${year}`;

  // Robust embed URL
  const videoId = getYouTubeId(video.link || video.embedLink);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  return (
    <div className='blog-post'>
      <div className='title'>{video.title}</div>
      <hr />
      <div className='date'>{dateFormatted}</div>
      <div className='video embed-responsive embed-responsive-16by9'>
        <iframe
          title={`${video.id}`}
          className='embed-responsive-item'
          src={embedUrl}
          allowFullScreen
        ></iframe>
      </div>
      <div className='yt-api-cont'>
        <div
          className='g-ytsubscribe'
          data-channelid='UC_jExvqWhRlM-gBt9iEsLxA'
          data-layout='default'
          data-count='default'
        ></div>
      </div>
    </div>
  );
};

export default Video;
