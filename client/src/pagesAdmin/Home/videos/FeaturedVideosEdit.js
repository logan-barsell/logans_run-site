import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import VideoContainer from '../../../components/Video/VideoContainer';
import VideoItem from '../../../components/Video/VideoItem';
import './featuredVideosEdit.css';
import { fetchFeaturedVideos } from '../../../redux/actions';
import { useAlert } from '../../../contexts/AlertContext';
import AddFeaturedVideo from './AddFeaturedVideo';
import EditFeaturedVideo from './EditFeaturedVideo';
import DeleteFeaturedVideo from './DeleteFeaturedVideo';
import { PageTitle, Divider, NoContent } from '../../../components/Header';

const FeaturedVideosEdit = ({ fetchFeaturedVideos, featuredVideos }) => {
  const { showError } = useAlert();
  const { data: videos, loading, error } = featuredVideos;

  useEffect(() => {
    fetchFeaturedVideos();
  }, [fetchFeaturedVideos]);

  // Handle errors from Redux state
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  return (
    <div
      id='featuredVideosEdit'
      className='mb-4 container'
    >
      <PageTitle divider>Featured Videos</PageTitle>
      <AddFeaturedVideo fetchVideos={fetchFeaturedVideos} />

      {/* Show loading state while fetching videos */}
      {loading ? (
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
      ) : error ? (
        <div
          className='alert alert-danger'
          role='alert'
        >
          <i className='fas fa-exclamation-triangle me-2'></i>
          {error}
        </div>
      ) : (
        <VideoContainer>
          {videos.length === 0 && <NoContent>No Featured Videos</NoContent>}
          {videos.map(video => (
            <VideoItem
              key={video._id}
              youtubeLink={video.youtubeLink}
              title={video.title}
              description={video.description}
              startTime={video.startTime}
              endTime={video.endTime}
              iframe={true}
            >
              <EditFeaturedVideo
                video={video}
                fetchVideos={fetchFeaturedVideos}
              />
              <DeleteFeaturedVideo
                video={video}
                fetchVideos={fetchFeaturedVideos}
              />
            </VideoItem>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  featuredVideos: state.featuredVideos,
});

const mapDispatchToProps = {
  fetchFeaturedVideos,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedVideosEdit);
