import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchVideos } from '../../redux/actions';
import Video from './Video';
import Button from '../../components/Button/Button';

const videoCount = 6;
const Videos = ({ fetchVideos, videos }) => {
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
          <option value='musicVids'>Music Videos</option>
          <option value='liveVids'>Live Performances</option>
          <option value='vlogs'>Vlogs</option>
        </select>
      </div>
      <hr />
      <div className='videos-container'>
        {filteredVideos && filteredVideos.length ? (
          filteredVideos.slice(0, limit).map(video => (
            <Video
              key={video._id}
              video={video}
            />
          ))
        ) : (
          <h3
            id='no_content'
            className='no-content'
          >
            No videos yet... check back soon!
          </h3>
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
  return { videos: videos?.data || [] };
}

export default connect(mapStateToProps, { fetchVideos })(Videos);
