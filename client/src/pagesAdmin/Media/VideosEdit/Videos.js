import './videos.css';

import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import AddVideo from './AddVideo';
import DeleteVideo from './DeleteVideo';
import EditVideo from './EditVideo';
import { fetchVideos } from '../../../redux/actions';
import VideoContainer from '../../../components/Video/VideoContainer';
import VideoItem from '../../../components/Video/VideoItem';
import { addVideoFields, VIDEO_COUNT } from './constants';

const VideosEdit = ({ fetchVideos, videos }) => {
  const [limit, setLimit] = useState(VIDEO_COUNT);

  const memoizedFetchVideos = useCallback(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    memoizedFetchVideos();
  }, [memoizedFetchVideos]);

  const loadMoreVids = () => {
    setLimit(limit + VIDEO_COUNT);
  };

  return (
    <>
      <div id='videoEdit'>
        <h3>Edit Videos</h3>
        <hr />
        <AddVideo fetchVideos={fetchVideos} />
        <VideoContainer>
          {(videos || [])?.slice(0, limit).map(video => {
            const categoryOption = addVideoFields[0].options.find(
              opt => opt.value === video.category
            );
            const categoryName = categoryOption
              ? categoryOption.name
              : video.category;
            return (
              <VideoItem
                key={video._id}
                youtubeLink={video.link}
                title={video.title}
                description={categoryName}
                iframe={true}
              >
                <EditVideo
                  video={video}
                  fetchVideos={fetchVideos}
                />
                <DeleteVideo
                  video={video}
                  fetchVideos={fetchVideos}
                />
              </VideoItem>
            );
          })}
        </VideoContainer>
        {limit < (videos?.length || 0) && (
          <div className='d-grid see-more'>
            <button
              onClick={loadMoreVids}
              className='btn btn-danger'
            >
              Load More Videos
            </button>
          </div>
        )}
        {(!videos || videos.length === 0) && (
          <h3 className='no-content'>No Videos</h3>
        )}
      </div>
    </>
  );
};

function mapStateToProps({ videos }) {
  return { videos: videos?.data || [] };
}

export default connect(mapStateToProps, { fetchVideos })(VideosEdit);
