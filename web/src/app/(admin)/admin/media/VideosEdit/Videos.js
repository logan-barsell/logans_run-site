'use client';

import './videos.css';

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVideos } from '../../../../../redux/actions';
import AddVideo from './AddVideo';
import EditVideo from './EditVideo';
import DeleteVideo from './DeleteVideo';
import VideoContainer from '../../../../../components/Video/VideoContainer';
import VideoItem from '../../../../../components/Video/VideoItem';
import Button from '../../../../../components/Button/Button.jsx';
import { addVideoFields } from './constants';
import { PageTitle, NoContent } from '../../../../../components/Header';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';
import { useAlert } from '../../../../../contexts/AlertContext';

const videoCount = 6;
const VideosEdit = () => {
  const dispatch = useDispatch();
  const videos = useSelector(state => state.videos?.data || []);
  const loading = useSelector(state => state.videos?.loading || false);
  const error = useSelector(state => state.videos?.error || null);
  const [limit, setLimit] = useState(videoCount);
  const { showError, showSuccess } = useAlert();
  const operationSuccessfulRef = useRef(false);

  useEffect(() => {
    dispatch(fetchVideos());
  }, [dispatch]);

  const loadMoreVids = () => {
    setLimit(limit + videoCount);
  };

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
      dispatch(fetchVideos());
      operationSuccessfulRef.current = false;
    }
  };

  return (
    <div id='videoEdit'>
      <PageTitle divider>Edit Videos</PageTitle>
      <AddVideo
        onSuccess={handleVideoSuccess}
        onError={handleVideoError}
        onClose={handleModalClose}
      />

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
        <>
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
                  key={video.id}
                  youtubeLink={video.link}
                  title={video.title}
                  description={categoryName}
                  iframe={true}
                >
                  <EditVideo
                    video={video}
                    onSuccess={handleVideoSuccess}
                    onError={handleVideoError}
                    onClose={handleModalClose} // NEW: pass the close callback
                  />
                  <DeleteVideo
                    video={video}
                    onSuccess={handleVideoSuccess}
                    onError={handleVideoError}
                    onClose={handleModalClose} // NEW: pass the close callback
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
        </>
      )}
    </div>
  );
};

export default VideosEdit;
