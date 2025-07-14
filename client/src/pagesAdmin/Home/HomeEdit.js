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
      <h3
        className='text-center mt-5'
        style={{ color: 'var(--main)' }}
      >
        Home
      </h3>
      <hr className='w-75 mx-auto' />
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
