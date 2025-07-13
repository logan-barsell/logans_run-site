import './homeEdit.css';

import React from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentShows from './shows/CurrentShows';
import CarouselEdit from './carousel/CarouselEdit';
import FeaturedVideosEdit from './videos/FeaturedVideosEdit';
import FeaturedReleasesEdit from './releases/FeaturedReleases';

const HomeEdit = () => {
  return (
    <>
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
};

export default HomeEdit;
