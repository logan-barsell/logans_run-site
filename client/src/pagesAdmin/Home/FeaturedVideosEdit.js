import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import VideoContainer from '../../components/Video/VideoContainer';
import VideoItem from '../../components/Video/VideoItem';
import './featuredVideosEdit.css';

const featuredVideoFields = (video = {}) => [
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    initialValue: video.title || '',
  },
  {
    label: 'Description',
    name: 'description',
    type: 'text',
    initialValue: video.description || '',
  },
  {
    label: 'YouTube Link',
    name: 'youtubeLink',
    type: 'text',
    initialValue: video.youtubeLink || '',
  },
  {
    label: 'Start Time (seconds)',
    name: 'startTime',
    type: 'number',
    initialValue: video.startTime || '',
  },
  {
    label: 'End Time (seconds)',
    name: 'endTime',
    type: 'number',
    initialValue: video.endTime || '',
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: video.releaseDate ? new Date(video.releaseDate) : '',
  },
];

const AddFeaturedVideo = ({ onAdd }) => {
  const modalProps = {
    id: 'add_featured_video',
    label: 'add_featured_video',
    title: 'NEW FEATURED VIDEO',
    buttonText: 'Add Featured Video',
  };

  const onSubmit = async fields => {
    await onAdd(fields);
  };

  const AddButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='addButton btn btn-danger'
      type='button'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='currentColor'
        className='bi bi-plus-square-fill'
        viewBox='0 0 16 16'
      >
        <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
      </svg>
      {modalProps.buttonText}
    </button>
  );

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<AddButton />}
    >
      <ModalForm
        fields={featuredVideoFields()}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

const EditFeaturedVideo = ({ video, onEdit }) => {
  const modalProps = {
    id: `edit_featured_video_${video._id}`,
    label: `edit_featured_video_label_${video._id}`,
    title: 'EDIT FEATURED VIDEO',
  };

  const onSubmit = async fields => {
    await onEdit({ ...fields, _id: video._id });
  };

  const EditButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='btn btn-sm btn-dark align-middle'
      type='button'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='currentColor'
        className='bi bi-pencil-square'
        viewBox='0 0 16 16'
      >
        <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
        <path
          fillRule='evenodd'
          d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
        />
      </svg>
      Edit
    </button>
  );

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<EditButton />}
    >
      <ModalForm
        fields={featuredVideoFields(video)}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

const DeleteFeaturedVideo = ({ video, onDelete }) => {
  const modalProps = {
    id: `del_featured_video_${video._id}`,
    label: `del_featured_video_label_${video._id}`,
    title: 'DELETE FEATURED VIDEO',
  };

  const ModalContent = () => (
    <>
      <div className='modal-body deleteItem'>Remove featured video?</div>
      <div className='modal-footer'>
        <button
          type='button'
          className='btn btn-dark'
          data-bs-dismiss='modal'
        >
          Cancel
        </button>
        <button
          onClick={() => onDelete(video._id)}
          type='button'
          data-bs-dismiss='modal'
          className='btn btn-danger'
        >
          Delete
        </button>
      </div>
    </>
  );

  const DeleteButton = () => (
    <button
      className='btn btn-sm btn-danger'
      type='button'
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        fill='currentColor'
        className='bi bi-trash-fill'
        viewBox='0 0 16 16'
      >
        <path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z' />
      </svg>
      Remove
    </button>
  );

  return (
    <CustomModal
      modalProps={modalProps}
      modalButton={<DeleteButton />}
    >
      <ModalContent />
    </CustomModal>
  );
};

const FeaturedVideosEdit = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/featuredVideos');
      setVideos(res.data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const addFeaturedVideo = async fields => {
    const payload = { ...fields };
    if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
      payload.releaseDate = new Date(payload.releaseDate);
    }
    await axios.post('/api/featuredVideos', payload);
    fetchFeaturedVideos();
  };

  const editFeaturedVideo = async fields => {
    const payload = { ...fields };
    if (payload.releaseDate && typeof payload.releaseDate !== 'object') {
      payload.releaseDate = new Date(payload.releaseDate);
    }
    await axios.put(`/api/featuredVideos/${fields._id}`, payload);
    fetchFeaturedVideos();
  };

  const deleteFeaturedVideo = async id => {
    await axios.delete(`/api/featuredVideos/${id}`);
    fetchFeaturedVideos();
  };

  return (
    <div
      id='featuredVideosEdit'
      className='mb-4 container'
    >
      <hr />
      <h3>Featured Videos</h3>
      <AddFeaturedVideo onAdd={addFeaturedVideo} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <VideoContainer>
          {videos.length === 0 && (
            <h3 className='no-content'>No Featured Videos</h3>
          )}
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
                onEdit={editFeaturedVideo}
              />
              <DeleteFeaturedVideo
                video={video}
                onDelete={deleteFeaturedVideo}
              />
            </VideoItem>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

export default FeaturedVideosEdit;
