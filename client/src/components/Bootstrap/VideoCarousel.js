import React from 'react';
import YouTubeSnippet from '../YouTubeSnippet';
import { YouTube } from '../icons';

function VideoCarousel({ videos }) {
  return (
    <div
      id='videoCarousel'
      className='carousel slide'
      data-bs-ride='carousel'
      data-bs-interval='15000'
    >
      <div className='carousel-inner'>
        {videos.map((video, idx) => (
          <div
            key={video.videoId}
            className={`carousel-item${idx === 0 ? ' active' : ''}`}
          >
            {/* make this container relative so overlay & caption can sit on top */}
            <div className='position-relative ratio ratio-16x9 w-100'>
              {/* your silent, UI-free snippet */}
              <YouTubeSnippet
                videoId={video.videoId}
                startTime={video.startTime}
                endTime={video.endTime}
              />

              {/* now layer your caption on top */}
              <div className='carousel-caption d-block carousel-caption-content'>
                <p className='carousel-title'>{video.title}</p>
                {video.description && (
                  <span className='carousel-desc secondary-font'>
                    {video.description}
                  </span>
                )}
                <a
                  href={`https://youtu.be/${video.videoId}`}
                  target='_blank'
                  rel='noreferrer'
                  className='btn btn-sm btn-dark text-white addButton d-flex gap-2 justify-content-center align-items-center'
                >
                  Watch Now <YouTube />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className='carousel-control-prev'
        type='button'
        data-bs-target='#videoCarousel'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' />
        <span className='visually-hidden'>Previous</span>
      </button>
      <button
        className='carousel-control-next'
        type='button'
        data-bs-target='#videoCarousel'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' />
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  );
}

export default VideoCarousel;
