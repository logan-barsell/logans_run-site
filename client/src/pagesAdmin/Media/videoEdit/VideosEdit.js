import './videoEdit.css';

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import AddVideo from './AddVideo';
import DeleteVideo from './DeleteVideo';
import EditVideo from './EditVideo';
import editVideoFields from './editVideoFields';
import { fetchVideos } from '../../../redux/actions';
import axios from 'axios';

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

  const currentVideos = videos?.slice(0, limit).map(video => (
    <div
      key={video._id}
      className='vid-container'
    >
      <div className='video embed-responsive embed-responsive-16by9'>
        <iframe
          title={video._id}
          className='embed-responsive-item'
          src={video.embedLink}
        ></iframe>
      </div>
      <div className='buttons d-grid gap-1'>
        <EditVideo
          video={video}
          editFields={editVideoFields}
          onEdit={editVideo}
        />
        <DeleteVideo
          video={video}
          onDelete={deleteVideo}
        />
      </div>
    </div>
  ));

  return (
    <>
      <div id='videoEdit'>
        <h3>Edit Videos</h3>
        <hr />
        <AddVideo />
        <div className='currentVideos'>{currentVideos}</div>
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
