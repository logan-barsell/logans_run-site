import React from 'react';
import './featuredReleasesCarousel.css';
import { capitalize } from '../../utils/strings';
import Button from '../Button/Button';

function FeaturedReleasesCarousel({ releases }) {
  return (
    <div
      id='featuredReleasesCarousel'
      className='carousel slide featured-releases-carousel'
      data-bs-ride='carousel'
      data-bs-interval='15000'
    >
      <div className='carousel-inner'>
        {releases.map((release, idx) => (
          <div
            key={release.id}
            className={`carousel-item${idx === 0 ? ' active' : ''}`}
          >
            <div className='featured-release-slide d-flex  flex-md-row align-items-center'>
              <div className='featured-release-cover flex-shrink-0'>
                <img
                  src={release.coverImage}
                  alt={release.title}
                  className='img-fluid rounded featured-release-img'
                />
              </div>
              <div className='featured-release-info d-flex flex-column justify-content-center align-items-center align-items-md-start text-center text-md-start p-3'>
                <div className='featured-release-title'>{release.title}</div>
                <div className='featured-release-type mb-2'>
                  {capitalize(release.type)} &middot;{' '}
                  {new Date(release.releaseDate).getFullYear()}
                </div>
                <Button
                  as='a'
                  href={release.musicLink}
                  target='_blank'
                  rel='noreferrer'
                  variant='outline-light'
                  className='featured-release-listen-btn mt-2'
                >
                  Listen
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className='carousel-control-prev'
        type='button'
        data-bs-target='#featuredReleasesCarousel'
        data-bs-slide='prev'
      >
        <span className='carousel-control-prev-icon' />
        <span className='visually-hidden'>Previous</span>
      </button>
      <button
        className='carousel-control-next'
        type='button'
        data-bs-target='#featuredReleasesCarousel'
        data-bs-slide='next'
      >
        <span className='carousel-control-next-icon' />
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  );
}

export default FeaturedReleasesCarousel;
