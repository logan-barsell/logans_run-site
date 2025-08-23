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
const VideosEdit = ({ fetchVideos, videos }) => {
  const [limit, setLimit] = useState(videoCount);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const loadMoreVids = () => {
    setLimit(limit + videoCount);
  };

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
  return { videos: videos?.data || [] };
}

export default connect(mapStateToProps, { fetchVideos })(VideosEdit);
