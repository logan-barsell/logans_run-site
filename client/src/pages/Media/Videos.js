import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideos } from '../../redux/actions';
import Video from './Video';
import Button from '../../components/Button/Button';
import { Divider, NoContent } from '../../components/Header';
import StaticAlert from '../../components/Alert/StaticAlert';

const videoCount = 6;
const Videos = ({ fetchVideos, videos, loading, error }) => {
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(videoCount);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleChange = selected => {
    setCategory(selected);
  };

  const seeMoreVids = () => {
    setLimit(limit + videoCount);
  };

  const filteredVideos = (videos || [])?.filter(video =>
    category !== 'all' ? video.category === category : true
  );

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
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  return (
    <div
      className='justify-content-center fadeIn'
      id='videos'
    >
      <div className='selectCategory'>
        <select
          defaultValue='all'
          onChange={e => handleChange(e.target.value)}
          className='form-select form-control form-select-md mb-3'
          aria-label='.form-select-lg example'
        >
          <option disabled>Select Category</option>
          <option value='all'>All Videos</option>
          <option value='MUSIC_VIDEO'>Music Videos</option>
          <option value='LIVE_PERFORMANCE'>Live Performances</option>
          <option value='VLOG'>Vlogs</option>
          <option value='LYRIC_VIDEO'>Lyric Videos</option>
        </select>
      </div>
      <Divider />
      <div className='videos-container'>
        {filteredVideos && filteredVideos.length ? (
          filteredVideos.slice(0, limit).map(video => (
            <Video
              key={video.id}
              video={video}
            />
          ))
        ) : (
          <NoContent>No videos yet... check back soon!</NoContent>
        )}
      </div>
      {limit < (filteredVideos?.length || 0) && (
        <div className='d-grid see-more'>
          <Button
            onClick={seeMoreVids}
            variant='danger'
          >
            Load More Videos
          </Button>
        </div>
      )}
    </div>
  );
};

function mapStateToProps({ videos }) {
  return {
    videos: videos?.data || [],
    loading: videos?.loading || false,
    error: videos?.error || null,
  };
}

export default connect(mapStateToProps, { fetchVideos })(Videos);
