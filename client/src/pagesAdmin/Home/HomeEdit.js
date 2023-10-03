import './homeEdit.css';

import React from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import CurrentShows from './CurrentShows';
import CarouselEdit from './carousel/CarouselEdit';

const HomeEdit = () => {

  
  return (
    <>
      <CarouselEdit />
      <SecondaryNav label={"Upcoming Shows"} />
      <div className="container">
        <div className="row">
          <CurrentShows />
        </div>
      </div>

    </>
  );
}

export default HomeEdit;