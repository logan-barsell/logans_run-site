import React, { useEffect } from 'react';
import axios from 'axios';
import { fetchShows } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Bootstrap/Accordion';
import AddShow from './AddShow';
import editShowFields from './editShowFields';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';

const CurrentShows = ({ fetchShows, shows }) => {
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  const deleteShow = async id => {
    const showToDelete = shows.find(show => show._id === id);
    if (showToDelete && showToDelete.poster) {
      try {
        await deleteImageFromFirebase(showToDelete.poster);
      } catch (error) {
        console.error('Error deleting image from Firebase:', error);
      }
    }

    axios.get(`/api/deleteShow/${id}`).then(() => {
      fetchShows();
    });
  };

  const editFields = show => {
    return editShowFields(show);
  };

  const editShow = async (
    _id,
    {
      poster,
      venue,
      location,
      date,
      doors,
      showtime,
      doorprice,
      advprice,
      tixlink,
    }
  ) => {
    const currentShow = shows.find(show => show._id === _id);
    let posterUrl = currentShow.poster || '';

    if (poster && poster[0]) {
      // Delete old image if it exists
      if (currentShow.poster) {
        try {
          await deleteImageFromFirebase(currentShow.poster);
        } catch (error) {
          console.error('Error deleting old image from Firebase:', error);
        }
      }

      // Upload new image
      try {
        posterUrl = await uploadImageToFirebase(poster[0]);
      } catch (err) {
        throw err;
      }
    }

    const updatedShow = {
      id: _id,
      poster: posterUrl,
      venue,
      location,
      date,
      doors,
      showtime,
      doorprice,
      advprice,
      tixlink,
    };

    axios.post(`/api/updateShow/${_id}`, updatedShow).then(() => {
      fetchShows();
    });
  };

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
                className='btn btn-light btn-sm'
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
                >
                  <path d='M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z'></path>
                </svg>
              </a>
            ) : null,
          },
        ],
      });
    });
  };
  createAccordionItems();

  return (
    <div className='my-5 mb-10'>
      <Accordion
        id='showsList'
        title='Shows'
        items={accordionItems}
        editFields={editFields}
        onEdit={editShow}
        onDelete={deleteShow}
      />
      <div className='d-flex mb-5'>
        <AddShow />
      </div>
    </div>
  );
};

function mapStateToProps({ shows }) {
  return { shows };
}

export default connect(mapStateToProps, { fetchShows })(CurrentShows);
