import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMediaImages } from '../../../redux/actions';
import Button from '../../../components/Button/Button';
import { NoContent } from '../../../components/Header';
import StaticAlert from '../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../components/LoadingSpinner';

const imgCount = 12;

export default function Pictures() {
  const dispatch = useDispatch();
  const images = useSelector(state => state.media?.data || []);
  const loading = useSelector(state => state.media?.loading || false);
  const error = useSelector(state => state.media?.error || null);

  const [limit, setLimit] = useState(imgCount);

  useEffect(() => {
    dispatch(fetchMediaImages());
  }, [dispatch]);

  const seeMoreImages = () => {
    setLimit(limit + imgCount);
  };

  const renderMediaImages = (images || []).slice(0, limit).map(image => {
    return (
      <div
        key={image.id}
        className='img-container'
      >
        <Image
          src={image.imgLink}
          alt='media'
          className='img-thumbnail'
          width={300}
          height={200}
          style={{ width: 'auto' }}
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
}
