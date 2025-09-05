import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../../redux/actions';
import Carousel from '../../../../components/Carousels/Carousel';
import StaticAlert from '../../../../components/Alert/StaticAlert';

const CarouselSection = ({ fetchHomeImages, images, loading, error }) => {
  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  // Show loading state
  if (loading) {
    return (
      <div className='parallax-carousel'>
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '200px' }}
        >
          <div
            className='spinner-border text-light'
            role='status'
          >
            <span className='visually-hidden'>Loading images...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  // Show carousel if we have images
  if (images.length > 0) {
    return (
      <div className='parallax-carousel'>
        <Carousel images={images} />
      </div>
    );
  }

  // No images available
  return null;
};

function mapStateToProps({ carouselImages }) {
  return {
    images: carouselImages?.data || [],
    loading: carouselImages?.loading || false,
    error: carouselImages?.error || null,
  };
}

export default connect(mapStateToProps, { fetchHomeImages })(CarouselSection);
