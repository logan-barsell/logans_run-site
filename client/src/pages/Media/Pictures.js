import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import Button from '../../components/Button/Button';

const imgCount = 12;
const Pictures = ({ fetchMediaImages, images }) => {
  const [limit, setLimit] = useState(imgCount);

  useEffect(() => {
    fetchMediaImages();
  }, [fetchMediaImages]);

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  const renderMediaImages = (images || []).slice(0, limit).map(image => {
    return (
      <div
        key={image._id}
        className='img-container'
      >
        <img
          src={image.imgLink}
          alt='media'
          className='img-thumbnail'
        />
      </div>
    );
  });

  return (
    <>
      {images && images.length > 0 ? (
        <>
          <div
            id='pictures'
            className='fadeIn'
          >
            {renderMediaImages}
          </div>
          {limit < images.length && (
            <div className='d-grid see-more'>
              <Button
                onClick={seeMoreImages}
                variant='danger'
              >
                Load More Images
              </Button>
            </div>
          )}
        </>
      ) : (
        <h3
          id='no_content'
          className='no-content'
        >
          No pictures yet... check back soon!
        </h3>
      )}
    </>
  );
};

function mapStateToProps({ media }) {
  return { images: media?.data || [] };
}

export default connect(mapStateToProps, { fetchMediaImages })(Pictures);
