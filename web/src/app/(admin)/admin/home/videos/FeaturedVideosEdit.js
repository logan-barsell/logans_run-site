'use client';

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VideoContainer from '../../../../../components/Video/VideoContainer';
import VideoItem from '../../../../../components/Video/VideoItem';
import './featuredVideosEdit.css';
import { fetchFeaturedVideos } from '../../../../../redux/actions';
import { useAlert } from '../../../../../contexts/AlertContext';
import AddFeaturedVideo from './AddFeaturedVideo';
import EditFeaturedVideo from './EditFeaturedVideo';
import DeleteFeaturedVideo from './DeleteFeaturedVideo';
import { PageTitle, NoContent } from '../../../../../components/Header';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';

const FeaturedVideosEdit = () => {
  const dispatch = useDispatch();
  const featuredVideos = useSelector(state => state.featuredVideos);
  const { showError, showSuccess } = useAlert();
  const { data: videos, loading, error } = featuredVideos;
  const operationSuccessfulRef = useRef(false);

  useEffect(() => {
    dispatch(fetchFeaturedVideos());
  }, [dispatch]);

  // Handle successful video operations
  const handleVideoSuccess = message => {
    showSuccess(message);
    // Set a flag that we had a successful operation
    operationSuccessfulRef.current = true;
  };

  const handleVideoError = error => {
    showError(error);
  };

  // Handle modal close - only refresh if operation was successful
  const handleModalClose = () => {
    if (operationSuccessfulRef.current) {
      dispatch(fetchFeaturedVideos());
      operationSuccessfulRef.current = false; // Reset flag
    }
  };

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
      <AddFeaturedVideo
        onSuccess={handleVideoSuccess}
        onError={handleVideoError}
        onClose={handleModalClose}
      />

      {/* Show loading state while fetching videos */}
      {loading ? (
        <LoadingSpinner
          size='lg'
          color='white'
          centered={true}
        />
      ) : error ? (
        <StaticAlert
          type={error.severity || 'danger'}
          title={error.title || 'Error'}
          description={error.message || error}
        />
      ) : (
        <VideoContainer>
          {videos.length === 0 && <NoContent>No Featured Videos</NoContent>}
          {videos.map(video => (
            <VideoItem
              key={video.id}
              youtubeLink={video.youtubeLink}
              videoUrl={video.videoFile}
              videoType={video.videoType}
              title={video.title}
              description={video.description}
              startTime={video.startTime}
              endTime={video.endTime}
              iframe={true}
            >
              <EditFeaturedVideo
                video={video}
                onSuccess={handleVideoSuccess}
                onError={handleVideoError}
                onClose={handleModalClose}
              />
              <DeleteFeaturedVideo
                video={video}
                onSuccess={handleVideoSuccess}
                onError={handleVideoError}
                onClose={handleModalClose}
              />
            </VideoItem>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

export default FeaturedVideosEdit;
