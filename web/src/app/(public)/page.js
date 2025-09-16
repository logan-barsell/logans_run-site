'use client';

import './home/Home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React from 'react';
import {
  CarouselSection,
  FeaturedVideosSection,
  FeaturedReleasesSection,
  ShowsSection,
} from './home/sections';

export default function HomePage() {
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
}
