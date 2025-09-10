import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchShows, fetchShowsSettings } from '../../../../redux/actions';
import SecondaryNav from '../../../../components/Navbar/SecondaryNav';
import ShowsAccordion from '../../ShowsAccordion';
import { BandsintownWidget } from '../../../../components/Bandsintown';
import StaticAlert from '../../../../components/Alert/StaticAlert';
import Button from '../../../../components/Button/Button';
import NoContent from '../../../../components/Header/NoContent';

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
        id,
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
        id: id,
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

  // Render the main content based on show system and availability
  const renderMainContent = () => {
    // Render Bandsintown widget if configured
    if (
      showsSettings.showSystem === 'bandsintown' &&
      showsSettings.bandsintownArtist
    ) {
      return (
        <div className='row justify-content-around'>
          <div className='bandsintown-widget-container'>
            <BandsintownWidget artistName={showsSettings.bandsintownArtist} />
          </div>
        </div>
      );
    }

    // Render custom shows if available
    if (shows[0]) {
      return (
        <div className='row justify-content-around'>
          <ShowsAccordion
            id='currentShows'
            title='Shows'
            items={accordionItems}
          />
        </div>
      );
    }

    // No shows available - show empty state
    return (
      <div className='row justify-content-center'>
        <div className='col-12 col-md-8 col-lg-6 text-center'>
          <div className='mt-5'>
            <NoContent>No Upcoming Shows</NoContent>
          </div>
        </div>
      </div>
    );
  };

  // Render the request a show section
  const renderRequestShowSection = () => (
    <div className='row justify-content-center'>
      <div className='col-12 col-md-8 col-lg-6 text-center'>
        <div className='py-4'>
          <h5
            className='mb-4'
            style={{ color: 'white', fontFamily: 'var(--secondary-font)' }}
          >
            Want to see us live?
          </h5>
          <Button
            variant='danger'
            size='sm'
            as='a'
            href='/contact'
            className='mb-3 w-50 mx-auto'
          >
            Request a Show
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SecondaryNav label='Upcoming Shows' />
      <div id='upcomingshows'>
        {renderMainContent()}
        {/* Only show request a show section for custom shows management */}
        {showsSettings.showSystem !== 'bandsintown' &&
          renderRequestShowSection()}
      </div>
    </>
  );
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
