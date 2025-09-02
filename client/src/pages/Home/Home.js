import './Home.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import React, { useEffect, useState } from 'react';
import Carousel from '../../components/Carousels/Carousel';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import ShowsAccordion from './ShowsAccordion';
import { BandsintownWidget } from '../../components/Bandsintown';
import { connect } from 'react-redux';
import {
  fetchHomeImages,
  fetchShows,
  fetchShowsSettings,
} from '../../redux/actions';
import VideoCarousel from '../../components/Carousels/VideoCarousel';
import FeaturedReleasesCarousel from '../../components/Carousels/FeaturedReleasesCarousel';
import {
  getFeaturedVideos,
  getFeaturedReleases,
} from '../../services/featuredContentService';
import { PageTitle, Divider } from '../../components/Header';

const HomePage = ({
  fetchShows,
  shows,
  fetchHomeImages,
  images,
  fetchShowsSettings,
  showsSettings,
}) => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [featuredReleases, setFeaturedReleases] = useState([]);

  useEffect(() => {
    fetchShows();
    fetchHomeImages();
    fetchShowsSettings();
    // Fetch featured videos
    getFeaturedVideos().then(res => {
      // Sort by releaseDate descending (newest first)
      const sorted = (res || []).sort(
        (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
      );
      // Map API data to VideoCarousel format
      const vids = sorted.map(v => {
        // Extract videoId from youtubeLink (supports full URL or share link)
        let videoId = '';
        try {
          const url = new URL(v.youtubeLink);
          if (url.hostname.includes('youtu.be')) {
            videoId = url.pathname.replace('/', '');
          } else if (url.hostname.includes('youtube.com')) {
            const params = new URLSearchParams(url.search);
            videoId = params.get('v');
          }
        } catch {
          // fallback: try to parse as ID
          videoId = v.youtubeLink;
        }
        return {
          videoId,
          title: v.title,
          description: v.description,
          startTime:
            v.startTime !== undefined &&
            v.startTime !== null &&
            v.startTime !== ''
              ? Number(v.startTime)
              : undefined,
          endTime:
            v.endTime !== undefined && v.endTime !== null && v.endTime !== ''
              ? Number(v.endTime)
              : undefined,
        };
      });
      setFeaturedVideos(vids);
    });
    // Fetch featured releases
    getFeaturedReleases().then(res => {
      setFeaturedReleases(res || []);
    });
  }, [fetchShows, fetchHomeImages, fetchShowsSettings]);

  const accordionItems = [];

  const createAccordionItems = () => {
    // Safety check: ensure shows is an array
    if (!Array.isArray(shows)) {
      console.error('Shows is not an array:', shows);
      return;
    }

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

      const dateString = date
        ? new Date(date).toLocaleString().split(',')[0]
        : 'TBD';
      const doorstimeString = doors
        ? new Date(doors).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'TBD';
      const showtimeString = showtime
        ? new Date(showtime).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'TBD';
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
      {/* IMG CAROUSEL */}
      <div className='parallax-carousel'>
        {images.length > 0 && <Carousel images={images} />}
      </div>

      {/* FEATURED VIDEOS */}
      {featuredVideos.length > 0 && <VideoCarousel videos={featuredVideos} />}

      {/* FEATURED RELEASES */}
      {featuredReleases.length > 0 && (
        <>
          <PageTitle
            divider
            color='white'
            className='secondary-font'
          >
            New Releases
          </PageTitle>
          <FeaturedReleasesCarousel releases={featuredReleases} />
        </>
      )}

      {/* UPCOMING SHOWS */}
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
  return {
    shows: shows?.data || [],
    images: carouselImages?.data || [],
    showsSettings: showsSettings?.data || {
      showSystem: 'custom',
      bandsintownArtist: '',
    },
  };
}

export default connect(mapStateToProps, {
  fetchShows,
  fetchHomeImages,
  fetchShowsSettings,
})(HomePage);
