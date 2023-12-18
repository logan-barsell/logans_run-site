import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';

const imgCount = 12;
const Pictures = ({ fetchMediaImages, images }) => {
  const [limit, setLimit] = useState(imgCount);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages])

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  const renderMediaImages = images.slice(0, limit).map(image => {
    return (
        <div key={image._id} className="img-container">
          <img src={image.imgLink} alt="media" className="img-thumbnail"/>
        </div>
    );
  });

  return (
    <>
      {images.length > 0 ?
      <>
        <div id="pictures" className="fadeIn">
          {renderMediaImages}
        </div>
        {limit < images.length &&
          <div className="d-grid see-more">
            <button onClick={seeMoreImages} className="btn btn-danger">Load More Images</button>
          </div>
        }
      </> :
      <h3 id="no_content">No pictures yet... check back soon!</h3>
      }
    </>
  );
}

function mapStateToProps({ media }) {
  return { images: media };
};

export default connect(mapStateToProps, { fetchMediaImages })(Pictures);