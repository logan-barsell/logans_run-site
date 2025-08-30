import './videos.css';

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchVideos } from '../../../redux/actions';
import AddVideo from './AddVideo';
import EditVideo from './EditVideo';
import DeleteVideo from './DeleteVideo';
import VideoContainer from '../../../components/Video/VideoContainer';
import VideoItem from '../../../components/Video/VideoItem';
import Button from '../../../components/Button/Button';
import { addVideoFields } from './constants';
import { PageTitle, Divider, NoContent } from '../../../components/Header';

const videoCount = 6;
const VideosEdit = ({ fetchVideos, videos, loading, error }) => {
  const [limit, setLimit] = useState(videoCount);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const loadMoreVids = () => {
    setLimit(limit + videoCount);
  };

  // Show loading state while fetching videos
  if (loading) {
    return (
      <div id='videoEdit'>
        <PageTitle divider>Edit Videos</PageTitle>
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
      </div>
    );
  }

  // Show error state if fetch failed
  if (error) {
    return (
      <div id='videoEdit'>
        <PageTitle divider>Edit Videos</PageTitle>
        <div
          className='alert alert-danger'
          role='alert'
        >
          <i className='fas fa-exclamation-triangle me-2'></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div id='videoEdit'>
        <PageTitle divider>Edit Videos</PageTitle>
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
            <Button
              onClick={loadMoreVids}
              variant='danger'
            >
              Load More Videos
            </Button>
          </div>
        )}
        {(!videos || videos.length === 0) && <NoContent>No Videos</NoContent>}
      </div>
    </>
  );
};

function mapStateToProps({ videos }) {
  return {
    videos: videos?.data || [],
    loading: videos?.loading || false,
    error: videos?.error || null,
  };
}

export default connect(mapStateToProps, { fetchVideos })(VideosEdit);
