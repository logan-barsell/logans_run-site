import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import Button from '../../components/Button/Button';
import { NoContent } from '../../components/Header';

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
        <NoContent>No pictures yet... check back soon!</NoContent>
      )}
    </>
  );
};

function mapStateToProps({ media }) {
  return { images: media?.data || [] };
}

export default connect(mapStateToProps, { fetchMediaImages })(Pictures);
