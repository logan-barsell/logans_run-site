import React, { useEffect } from 'react';
import axios from 'axios';
import { fetchShows } from '../../redux/actions';
import { connect } from 'react-redux';
import Accordion from '../../components/Bootstrap/Accordion';
import AddShow from './AddShow';
import editShowFields from './editShowFields';

const CurrentShows = ({ fetchShows, shows }) => {

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);


  const deleteShow = id => {
    axios.get(`/api/deleteShow/${id}`).then(res => {
      fetchShows();
    });
  };

  const editFields = show => {
    return editShowFields(show);
  };

  const editShow = (_id, { poster, venue, location, date, doors, showtime, doorprice, advprice, tixlink }) => {
    const newPhoto = poster ? poster[0] : '';
    const updatedShow = {
      id: _id,
      poster: newPhoto,
      venue,
      location,
      date,
      doors,
      showtime,
      doorprice,
      advprice,
      tixlink
    };

    console.log(updatedShow);

    const payload = new FormData();
    for (let key in updatedShow) {
      if(updatedShow[key]) {
        payload.append(key, updatedShow[key]);
      }
    }

    axios.post(`/api/updateShow/${_id}`, payload).then(res => {
      fetchShows();
    });

  }

  const accordionItems = [];

  const createAccordionItems = () => {
    shows.map((show) => {
      const { _id, poster, venue, location, date, doors, showtime, doorprice, advprice, tixlink } = show;
      const blob = new Blob([Int8Array.from(poster.img.image.data)], {type: poster.img.contentType});
      const imgURL = window.URL.createObjectURL(blob);
      const dateString = new Date(date).toLocaleString().split(',')[0];
      const doorstimeString = new Date(doors).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
      const showtimeString = new Date(showtime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
      return accordionItems.push({
        data: show,
        group: 'shows',
        id: _id,
        name: venue,
        header: venue,
        img: imgURL,
        subhead: location,
        content: [
          { prefix: 'Date: ', value: dateString },
          { prefix: 'Doors: ', value: doorstimeString },
          { prefix: 'Show: ', value: showtimeString },
          { prefix: 'Door Price: ', value: doorprice },
          { prefix: 'Adv. Price: ', value: advprice },
          { prefix: 'Ticket Link: ', value: tixlink ? (<a className="btn btn-danger btn-sm" target="_blank" rel="noreferrer" href={tixlink}>Tickets</a>) : null }
        ]
      });
    });
  }
  createAccordionItems();

  return (
    <div className="my-5">
    <Accordion
        id="showsList"
        title="Shows"
        items={accordionItems}
        editFields={editFields}
        onEdit={editShow}
        onDelete={deleteShow}
      />
    <div className="d-flex mb-5">
      <AddShow />
    </div>
    </div>
  );
}

function mapStateToProps({ shows }) {
  return { shows };
}

export default connect(mapStateToProps, { fetchShows })(CurrentShows);
