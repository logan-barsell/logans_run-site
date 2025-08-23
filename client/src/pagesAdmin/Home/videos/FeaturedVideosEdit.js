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
  const { showError } = useAlert();

  const fetchVideos = React.useCallback(async () => {
    try {
      const data = await getFeaturedVideos();
      setVideos(data);
    } catch (err) {
      showError(err.message || 'Failed to load featured videos');
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
      {
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
      }
    </div>
  );
};

export default FeaturedVideosEdit;
