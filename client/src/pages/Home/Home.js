import './Home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React, { useEffect } from 'react';
import Carousel from '../../components/Bootstrap/Carousel';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import ShowsAccordion from './ShowsAccordion';
import BandsintownWidget from '../../components/BandsintownWidget';
import { connect } from 'react-redux';
import {
  fetchHomeImages,
  fetchShows,
  fetchShowsSettings,
} from '../../redux/actions';

const HomePage = ({
  fetchShows,
  shows,
  fetchHomeImages,
  images,
  fetchShowsSettings,
  showsSettings,
}) => {
  useEffect(() => {
    fetchShows();
    fetchHomeImages();
    fetchShowsSettings();
  }, [fetchShows, fetchHomeImages, fetchShowsSettings]);

  const accordionItems = [];

  const createAccordionItems = () => {
    shows.map(show => {
      const {
        _id,
        poster,
        venue,
        location,
        date,
        doors,
        showtime,
        doorprice,
        advprice,
        tixlink,
      } = show;

      const dateString = new Date(date).toLocaleString().split(',')[0];
      const doorstimeString = new Date(doors).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });
      const showtimeString = new Date(showtime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      });
      return accordionItems.push({
        id: _id,
        venue,
        date: dateString,
        poster: poster,
        location,
        tixlink,
        content: [
          { value: dateString },
          { prefix: 'Doors: ', value: doorstimeString },
          { prefix: 'Show: ', value: showtimeString },
          { prefix: 'Adv. Price: ', value: advprice ? `$${advprice}` : null },
          { prefix: 'Door Price: ', value: doorprice ? `$${doorprice}` : null },
        ],
      });
    });
  };

  createAccordionItems();

  return (
    <div
      id='home'
      className='fadeIn'
    >
      <div className='parallax-carousel'>
        {images.length > 0 && <Carousel images={images} />}
      </div>
      {showsSettings.showSystem === 'bandsintown' &&
      showsSettings.bandsintownArtist ? (
        <>
          <SecondaryNav label='Upcoming Shows' />
          <div id='upcomingshows'>
            <div className='row justify-content-around'>
              <div className='bandsintown-widget-container'>
                <BandsintownWidget
                  artistName={showsSettings.bandsintownArtist}
                />
              </div>
            </div>
          </div>
        </>
      ) : shows[0] ? (
        <>
          <SecondaryNav label='Upcoming Shows' />
          <div id='upcomingshows'>
            <div className='row justify-content-around'>
              <ShowsAccordion
                id='currentShows'
                title='Shows'
                items={accordionItems}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

function mapStateToProps({ shows, carouselImages, showsSettings }) {
  return { shows, images: carouselImages, showsSettings };
}

export default connect(mapStateToProps, {
  fetchShows,
  fetchHomeImages,
  fetchShowsSettings,
})(HomePage);
