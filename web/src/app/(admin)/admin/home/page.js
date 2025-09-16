'use client';

import './homeEdit.css';

import React from 'react';
import SecondaryNav from '../../../../components/Navbar/SecondaryNav/SecondaryNav';
import CurrentShows from './shows/CurrentShows';
import CarouselEdit from './carousel/CarouselEdit';
import FeaturedVideosEdit from './videos/FeaturedVideosEdit';
import FeaturedReleasesEdit from './releases/FeaturedReleases';
import { PageTitle } from '../../../../components/Header';

export default function HomeEditPage() {
  return (
    <>
      <PageTitle divider>Home</PageTitle>
      <CarouselEdit />
      <FeaturedVideosEdit />
      <FeaturedReleasesEdit />
      <SecondaryNav label={'Upcoming Shows'} />
      <div className='container'>
        <div className='row'>
          <CurrentShows />
        </div>
      </div>
    </>
  );
}
