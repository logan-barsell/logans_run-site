import 'bootstrap/dist/js/bootstrap.bundle';

import React, { useEffect } from 'react';
// import { shows } from './ShowDetails';
import SnipcartButton from '../Merch/SnipcartButton';
import InfoCollapse from '../Bootstrap/InfoCollapse';
import { connect } from 'react-redux';
import { fetchShows } from '../../actions';

const ShowAd = ({ shows, fetchShows }) => {

  useEffect(() => {
    fetchShows();
  }, [fetchShows])

  const renderShows = shows.map(show => {
    return (
      <div key={show._id} className="col-sm showad">
        <div className="card"><img className="card-img-top" src={show.poster} alt="PromoFlyer" /></div>
        <InfoCollapse show={show} />
        <div className="d-grid gap-2">
          {show.tixlink === null ?
            <SnipcartButton data={show.snipcartData} />
            :
            <button className="btn btn-danger">
              <a href={show.tixlink} className="gettix card-link" target="_blank" rel="noreferrer">Get Tickets</a>
            </button>
          }
        </div>
      </div>
    );
  });

  return (
    <>
      {renderShows}
    </>
  );
};

function mapStateToProps({ shows }) {
  return { shows };
}

export default connect(mapStateToProps, { fetchShows })(ShowAd);