import React, { useEffect, useState } from 'react';
import VideoContainer from '../../../components/Video/VideoContainer';
import VideoItem from '../../../components/Video/VideoItem';
import './featuredVideosEdit.css';
import { getFeaturedVideos } from '../../../services/featuredContentService';
import { useAlert } from '../../../contexts/AlertContext';
import AddFeaturedVideo from './AddFeaturedVideo';
import EditFeaturedVideo from './EditFeaturedVideo';
import DeleteFeaturedVideo from './DeleteFeaturedVideo';
import { PageTitle, Divider, NoContent } from '../../../components/Header';

const FeaturedVideosEdit = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useAlert();

  const fetchVideos = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedVideos();
      setVideos(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load featured videos';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div
      id='featuredVideosEdit'
      className='mb-4 container'
    >
      <Divider />
      <PageTitle>Featured Videos</PageTitle>
      <AddFeaturedVideo fetchVideos={fetchVideos} />

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
                fetchVideos={fetchVideos}
              />
              <DeleteFeaturedVideo
                video={video}
                fetchVideos={fetchVideos}
              />
            </VideoItem>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

export default FeaturedVideosEdit;
