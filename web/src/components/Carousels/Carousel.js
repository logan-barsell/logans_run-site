import React from 'react';
import Image from 'next/image';

const Carousel = ({ images }) => {
  return (
    <div
      className='carousel slide carousel-fade'
      id='carouselExampleIndicators'
      data-bs-ride='carousel'
    >
      <div className='carousel-inner'>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`carousel-item ${index === 0 && 'active'}`}
          >
            <Image
              className='d-block w-100'
              src={image.imgLink}
              alt='First slide'
              width={800}
              height={400}
              style={{ height: 'auto' }}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type='button'
            className='carousel-control-prev'
            href='#carouselExampleIndicators'
            data-bs-slide='prev'
          >
            <span
              className='carousel-control-prev-icon'
              aria-hidden='true'
            ></span>
            <span className='visually-hidden'>Previous</span>
          </button>
          <button
            type='button'
            className='carousel-control-next'
            href='#carouselExampleIndicators'
            data-bs-slide='next'
          >
            <span
              className='carousel-control-next-icon'
              aria-hidden='true'
            ></span>
            <span className='visually-hidden'>Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
