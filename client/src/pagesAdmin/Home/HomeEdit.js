import './homeEdit.css';

import React from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentShows from './shows/CurrentShows';
import CarouselEdit from './carousel/CarouselEdit';
import FeaturedVideosEdit from './videos/FeaturedVideosEdit';
import FeaturedReleasesEdit from './releases/FeaturedReleases';
import { PageTitle, Divider } from '../../components/Header';

const HomeEdit = () => {
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
};

export default HomeEdit;
