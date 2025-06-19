import React from 'react';

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

  return (
    <div className='blog-post'>
      <div className='title'>{video.title}</div>
      <hr />
      <div className='date'>{dateFormatted}</div>
      <div className='video embed-responsive embed-responsive-16by9'>
        <iframe
          title={`${video.id}`}
          className='embed-responsive-item'
          src={video.embedLink}
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
