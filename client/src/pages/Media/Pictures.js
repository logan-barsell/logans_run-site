import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchMediaImages } from '../../redux/actions';
import Button from '../../components/Button/Button';
import { NoContent } from '../../components/Header';
import StaticAlert from '../../components/Alert/StaticAlert';
import { PageLoader } from '../../components/LoadingSpinner';

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
        key={image.id}
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
    return <PageLoader />;
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div
        id='pictures'
        className='justify-content-center fadeIn'
      >
        <div style={{ paddingTop: '60px' }}>
          <StaticAlert
            type={error.severity}
            title={error.title}
            description={error.message}
          />
        </div>
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
  return (
    <div className='my-5 px-3'>
      <NoContent>No pictures yet... check back soon!</NoContent>
    </div>
  );
};

function mapStateToProps({ media }) {
  return {
    images: media?.data || [],
    loading: media?.loading || false,
    error: media?.error || null,
  };
}

export default connect(mapStateToProps, { fetchMediaImages })(Pictures);
