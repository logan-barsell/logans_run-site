import React from 'react';
import Accordion from '../../../components/Bootstrap/Accordion';
import AddShow from './AddShow';
import EditShow from './EditShow';
import DeleteShow from './DeleteShow';
import { editShowFields } from './constants';

const CustomShowsManagement = ({ shows, fetchShows }) => {
  const createAccordionItems = () => {
    const accordionItems = [];

    shows.forEach(show => {
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

      accordionItems.push({
        data: show,
        group: 'shows',
        id: _id,
        name: venue,
        header: venue,
        img: poster,
        subhead: location,
        content: [
          { prefix: 'Date: ', value: dateString },
          { prefix: 'Doors: ', value: doorstimeString },
          { prefix: 'Show: ', value: showtimeString },
          { prefix: 'Adv. Price: ', value: `$${advprice}` },
          { prefix: 'Door Price: ', value: `$${doorprice}` },
          {
            prefix: 'Ticket Link: ',
            value: tixlink ? (
              <a
                className='btn btn-outline-light btn-sm'
                target='_blank'
                rel='noreferrer'
                href={tixlink}
              >
                Tickets{' '}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  x='0px'
                  y='0px'
                  width='20'
                  height='20'
                  viewBox='0 0 30 30'
                  fill='currentColor'
                >
                  <path d='M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z'></path>
                </svg>
              </a>
            ) : null,
          },
        ],
        actions: (
          <>
            <EditShow
              show={show}
              fetchShows={fetchShows}
            />
            <DeleteShow
              show={show}
              fetchShows={fetchShows}
            />
          </>
        ),
      });
    });

    return accordionItems;
  };

  return (
    <div className=''>
      <Accordion
        id='showsList'
        title='Shows'
        items={createAccordionItems()}
      />
      <div className='d-flex mb-5'>
        <AddShow fetchShows={fetchShows} />
      </div>
    </div>
  );
};

export default CustomShowsManagement;
