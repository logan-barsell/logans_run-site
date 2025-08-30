import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import Button from '../../components/Button/Button';
import { NoContent } from '../../components/Header';

const imgCount = 12;
const Pictures = ({ fetchMediaImages, images, loading, error }) => {
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

  // Show loading state while fetching data
  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        className='alert alert-danger'
        role='alert'
      >
        <i className='fas fa-exclamation-triangle me-2'></i>
        {error}
      </div>
    );
  }

  // Show content if we have images
  if (images && images.length > 0) {
    return (
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
    );
  }

  // Show no content only after loading is complete and no data
  return <NoContent>No pictures yet... check back soon!</NoContent>;
};

function mapStateToProps({ media }) {
  return {
    images: media?.data || [],
    loading: media?.loading || false,
    error: media?.error || null,
  };
}

export default connect(mapStateToProps, { fetchMediaImages })(Pictures);
