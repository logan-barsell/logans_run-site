import './Home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React, { useEffect } from 'react';
import Carousel from '../../components/Bootstrap/Carousel';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import ShowsAccordion from './ShowsAccordion';
import { connect } from 'react-redux';
import { fetchHomeImages, fetchShows } from '../../redux/actions';

const HomePage = ({ fetchShows, shows, fetchHomeImages, images }) => {
  useEffect(() => {
    fetchShows();
    fetchHomeImages();
  }, [fetchShows, fetchHomeImages]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const carousel = document.querySelector('.parallax-carousel');
      if (carousel) {
        carousel.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          { prefix: 'Doors ', value: doorstimeString },
          { prefix: 'Show ', value: showtimeString },
          { prefix: 'Door Price ', value: doorprice ? `$${doorprice}` : null },
          { prefix: 'Adv. Price ', value: advprice ? `$${advprice}` : null },
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
      <div className='home-content-below-carousel'>
        {shows[0] ? (
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
    </div>
  );
};

function mapStateToProps({ shows, carouselImages }) {
  return { shows, images: carouselImages };
}

export default connect(mapStateToProps, { fetchShows, fetchHomeImages })(
  HomePage
);
