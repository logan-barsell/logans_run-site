'use client';

import React from 'react';
import Accordion from '../../../../../components/Accordion/Accordion';
import '../../../../../components/Accordion/accordion.css';
import AddShow from './AddShow';
import EditShow from './EditShow';
import DeleteShow from './DeleteShow';
import { Ticket } from '../../../../../components/icons';
import Button from '../../../../../components/Button/Button.jsx';

const CustomShowsManagement = ({
  shows,
  fetchShows,
  onSuccess,
  onError,
  onClose,
}) => {
  const createAccordionItems = () => {
    const accordionItems = [];

    shows.forEach(show => {
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

      accordionItems.push({
        data: show,
        group: 'shows',
        id,
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
              <Button
                as='a'
                size='sm'
                variant='outline-light'
                target='_blank'
                rel='noreferrer'
                href={tixlink}
                icon={<Ticket />}
                iconPosition='right'
                className='mx-auto'
              >
                Tickets
              </Button>
            ) : null,
          },
        ],
        actions: (
          <>
            <EditShow
              show={show}
              onSuccess={onSuccess}
              onError={onError}
              onClose={onClose}
            />
            <DeleteShow
              show={show}
              onSuccess={onSuccess}
              onError={onError}
              onClose={onClose}
            />
          </>
        ),
      });
    });

    return accordionItems;
  };

  return (
    <div className='mt-5'>
      <Accordion
        id='showsList'
        title='Shows'
        items={createAccordionItems()}
      />
      <div className='d-flex mb-5'>
        <AddShow
          onSuccess={onSuccess}
          onError={onError}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default CustomShowsManagement;
