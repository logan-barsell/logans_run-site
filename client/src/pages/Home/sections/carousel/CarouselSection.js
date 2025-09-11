import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchHomeImages } from '../../../../redux/actions';
import Carousel from '../../../../components/Carousels/Carousel';
import StaticAlert from '../../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../../components/LoadingSpinner';

const CarouselSection = ({ fetchHomeImages, images, loading, error }) => {
  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  // Show loading state
  if (loading) {
    return <PageLoader />;
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
