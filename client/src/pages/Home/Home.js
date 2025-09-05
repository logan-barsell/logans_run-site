import './Home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React from 'react';
import {
  CarouselSection,
  FeaturedVideosSection,
  FeaturedReleasesSection,
  ShowsSection,
} from './sections';

const HomePage = () => {
  return (
    <div
      id='home'
      className='fadeIn'
    >
      <CarouselSection />
      <FeaturedVideosSection />
      <FeaturedReleasesSection />
      <ShowsSection />
    </div>
  );
};

export default HomePage;
