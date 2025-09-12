import React, { useEffect, useRef, useState } from 'react';
import YouTubeSnippet from '../YouTubeSnippet';
import VideoPlayer from '../Video/VideoPlayer';
import { YouTube } from '../icons';
import Button from '../Button/Button';

function VideoCarousel({ videos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const handleSlid = e => {
      // Prefer Bootstrap's provided index; fallback to DOM query
      if (typeof e.to === 'number') {
        setActiveIndex(e.to);
      } else {
        const items = Array.from(el.querySelectorAll('.carousel-item'));
        const idx = items.findIndex(item => item.classList.contains('active'));
        if (idx >= 0) setActiveIndex(idx);
      }
    };

    el.addEventListener('slid.bs.carousel', handleSlid);
    return () => {
      el.removeEventListener('slid.bs.carousel', handleSlid);
    };
  }, []);

  return (
    <div
      id='videoCarousel'
      className='carousel slide'
      data-bs-ride='carousel'
      data-bs-interval='15000'
      ref={carouselRef}
    >
      <div className='carousel-inner'>
        {videos.map((video, idx) => (
          <div
            key={video.id}
            className={`carousel-item${idx === 0 ? ' active' : ''}`}
          >
            {/* make this container relative so overlay & caption can sit on top */}
            <div className='position-relative ratio ratio-16x9 w-100'>
              {/* Render video based on type */}
              {video.videoType === 'upload' && video.videoFile ? (
                <VideoPlayer
                  videoUrl={video.videoFile}
                  startTime={video.startTime}
                  endTime={video.endTime}
                  active={idx === activeIndex}
                  poster={video.videoThumbnail}
                />
              ) : (
                <YouTubeSnippet
                  videoId={video.videoId}
                  startTime={video.startTime}
                  endTime={video.endTime}
                  active={idx === activeIndex}
                />
              )}

              {/* now layer your caption on top - only show if displayMode is 'full' */}
              {video.displayMode !== 'videoOnly' && (
                <div className='carousel-caption d-block carousel-caption-content'>
                  <p className='carousel-title'>{video.title}</p>
                  {video.description && (
                    <span className='carousel-desc secondary-font'>
                      {video.description}
                    </span>
                  )}
                  <Button
                    as='a'
                    href={video.youtubeLink}
                    target='_blank'
                    rel='noreferrer'
                    variant='outline-light'
                    size='sm'
                    className='addButton'
                    iconPosition='right'
                    icon={<YouTube />}
                  >
                    Watch Now
                  </Button>
                </div>
              )}
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
