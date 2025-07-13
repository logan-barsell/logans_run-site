import './homeEdit.css';

import React from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentShows from './CurrentShows';
import CarouselEdit from './carousel/CarouselEdit';
import FeaturedVideosEdit from './FeaturedVideosEdit';
import FeaturedReleasesEdit from './FeaturedReleasesEdit';

function mapStateToProps({ carouselImages }) {
  return { images: carouselImages?.data || [] };
}

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
