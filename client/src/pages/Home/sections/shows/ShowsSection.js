import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchShows, fetchShowsSettings } from '../../../../redux/actions';
import SecondaryNav from '../../../../components/Navbar/SecondaryNav';
import ShowsAccordion from '../../ShowsAccordion';
import { BandsintownWidget } from '../../../../components/Bandsintown';
import StaticAlert from '../../../../components/Alert/StaticAlert';

const ShowsSection = ({
  fetchShows,
  fetchShowsSettings,
  shows,
  showsSettings,
  showsLoading,
  showsSettingsLoading,
  showsError,
  showsSettingsError,
}) => {
  useEffect(() => {
    fetchShows();
    fetchShowsSettings();
  }, [fetchShows, fetchShowsSettings]);

  // Show loading state
  if (showsLoading || showsSettingsLoading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading shows...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (showsError || showsSettingsError) {
    const error = showsError || showsSettingsError;
    return (
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  // Create accordion items for custom shows
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

  // Render Bandsintown widget if configured
  if (
    showsSettings.showSystem === 'bandsintown' &&
    showsSettings.bandsintownArtist
  ) {
    return (
      <>
        <SecondaryNav label='Upcoming Shows' />
        <div id='upcomingshows'>
          <div className='row justify-content-around'>
            <div className='bandsintown-widget-container'>
              <BandsintownWidget artistName={showsSettings.bandsintownArtist} />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render custom shows if available
  if (shows[0]) {
    return (
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
    );
  }

  // No shows available
  return null;
};

function mapStateToProps({ shows, showsSettings }) {
  return {
    shows: shows?.data || [],
    showsSettings: showsSettings?.data || {
      showSystem: 'custom',
      bandsintownArtist: '',
    },
    showsLoading: shows?.loading || false,
    showsSettingsLoading: showsSettings?.loading || false,
    showsError: shows?.error || null,
    showsSettingsError: showsSettings?.error || null,
  };
}

export default connect(mapStateToProps, { fetchShows, fetchShowsSettings })(
  ShowsSection
);
