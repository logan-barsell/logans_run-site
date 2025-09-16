import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHomeImages } from '../../../../../redux/actions';
import Carousel from '../../../../../components/Carousels/Carousel';
import StaticAlert from '../../../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../../../components/LoadingSpinner';

export default function CarouselSection() {
  const dispatch = useDispatch();
  const images = useSelector(state => state.carouselImages?.data || []);
  const loading = useSelector(state => state.carouselImages?.loading || false);
  const error = useSelector(state => state.carouselImages?.error || null);

  useEffect(() => {
    dispatch(fetchHomeImages());
  }, [dispatch]);

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
}
