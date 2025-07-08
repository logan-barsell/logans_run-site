import './videoEdit.css';

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AddVideo, { addVideoFields } from './AddVideo';
import DeleteVideo from './DeleteVideo';
import EditVideo from './EditVideo';
import editVideoFields from './editVideoFields';
import { fetchVideos } from '../../../redux/actions';
import axios from 'axios';
import VideoContainer from '../../../components/Video/VideoContainer';
import VideoItem from '../../../components/Video/VideoItem';

const videoCount = 6;
const VideosEdit = ({ fetchVideos, videos }) => {
  const [limit, setLimit] = useState(videoCount);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const editVideo = video => {
    const path = new URL(video.link).pathname;
    const embedLink = `https://www.youtube.com/embed${path}`;
    const updatedVideo = { ...video, embedLink };

    axios
      .post('/api/updateVideo', updatedVideo)
      .then(res => fetchVideos())
      .catch(err => console.log(err));
  };

  const deleteVideo = id => {
    axios
      .get(`/api/deleteVideo/${id}`)
      .then(res => fetchVideos())
      .catch(err => console.log(err));
  };

  const loadMoreVids = () => {
    setLimit(limit + videoCount);
  };

  return (
    <>
      <div id='videoEdit'>
        <h3>Edit Videos</h3>
        <hr />
        <AddVideo />
        <VideoContainer>
          {videos?.slice(0, limit).map(video => {
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
                  editFields={editVideoFields}
                  onEdit={editVideo}
                />
                <DeleteVideo
                  video={video}
                  onDelete={deleteVideo}
                />
              </VideoItem>
            );
          })}
        </VideoContainer>
        {limit < videos.length && (
          <div className='d-grid see-more'>
            <button
              onClick={loadMoreVids}
              className='btn btn-danger'
            >
              Load More Videos
            </button>
          </div>
        )}
        {videos.length === 0 && <h3 className='no-content'>No Videos</h3>}
      </div>
    </>
  );
};

function mapStateToProps({ videos }) {
  return { videos };
}

export default connect(mapStateToProps, { fetchVideos })(VideosEdit);
