import { useState, useEffect } from 'react';
import { Collapse } from 'bootstrap';

const InfoCollapse = ({ show }) => {
  var [toggle, setToggle] = useState(false);

  useEffect(() => {
    var myCollapse = document.getElementById(`show${show._id}`);
    var bsCollapse = new Collapse(myCollapse, { toggle: false });
    toggle ? bsCollapse.show() : bsCollapse.hide()
  });

  const dateString = new Date(show.date).toLocaleString().split(',')[0];
  const doorstimeString = new Date(show.doors).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
  const showtimeString = new Date(show.showtime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });

  return (
    <>
      <div className="d-grid gap-2">
        <button
          className="btn btn-dark"
          type="button"
          onClick={() => setToggle(toggle => !toggle)}
        >
          Show Info
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </button>
      </div>
      <div className={`col-sm showinfo collapse multi-collapse`} id={`show${show._id}`}>
        <div className="card">
          <div className="card-body text-center">
            <h5 className="card-title">{show.venue}</h5>
            <p className="card-text">{show.city}</p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Date: <span>{dateString}</span></li>
            <li className="list-group-item">Time: <span>Doors: {doorstimeString}, Show: {showtimeString}</span></li>
            <li className="list-group-item">Price: <span>${show.advprice} Adv, ${show.doorprice} Door </span></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default InfoCollapse;