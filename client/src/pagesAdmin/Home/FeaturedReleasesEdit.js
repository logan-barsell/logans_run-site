import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import VideoContainer from '../../components/Video/VideoContainer';
import {
  uploadImageToFirebase,
  deleteImageFromFirebase,
} from '../../utils/firebaseImage';
import './featuredReleasesEdit.css';

const releaseTypes = [
  { name: 'Album', value: 'album' },
  { name: 'Single', value: 'single' },
  { name: 'EP', value: 'EP' },
  { name: 'LP', value: 'LP' },
];

const featuredReleaseFields = (release = {}) => [
  {
    label: 'Cover Image',
    name: 'coverImage',
    type: 'image',
    initialValue: release.coverImage || '',
  },
  {
    label: 'Title',
    name: 'title',
    type: 'text',
    initialValue: release.title || '',
  },
  {
    label: 'Type',
    name: 'type',
    type: 'options',
    options: releaseTypes,
    initialValue: release.type || 'album',
  },
  {
    label: 'Release Date',
    name: 'releaseDate',
    type: 'date',
    initialValue: release.releaseDate ? new Date(release.releaseDate) : '',
  },
  {
    label: 'Music Link',
    name: 'musicLink',
    type: 'text',
    initialValue: release.musicLink || '',
  },
];

const AddFeaturedRelease = ({ onAdd }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmit = async fields => {
    setUploading(true);
    let coverImageUrl = '';
    if (fields.coverImage && fields.coverImage[0]) {
      coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
        onProgress: setUploadProgress,
      });
    }
    const payload = {
      ...fields,
      coverImage: coverImageUrl,
      releaseDate: fields.releaseDate
        ? new Date(fields.releaseDate)
        : undefined,
    };
    await onAdd(payload);
    setUploading(false);
  };

  const modalProps = {
    id: 'add_featured_release',
    label: 'add_featured_release',
    title: 'NEW FEATURED RELEASE',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replace('0', 'O')}%`
      : 'Add Featured Release',
  };

  const AddButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='addButton btn btn-danger'
      type='button'
      disabled={uploading}
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
        fields={featuredReleaseFields()}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

const EditFeaturedRelease = ({ release, onEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onSubmit = async fields => {
    setUploading(true);
    let coverImageUrl = release.coverImage;
    if (fields.coverImage && fields.coverImage[0]) {
      // Delete old image if exists
      if (release.coverImage) {
        try {
          await deleteImageFromFirebase(release.coverImage);
        } catch (error) {
          // ignore
        }
      }
      coverImageUrl = await uploadImageToFirebase(fields.coverImage[0], {
        onProgress: setUploadProgress,
      });
    }
    const payload = {
      ...fields,
      coverImage: coverImageUrl,
      releaseDate: fields.releaseDate
        ? new Date(fields.releaseDate)
        : undefined,
    };
    await onEdit(release._id, payload);
    setUploading(false);
  };

  const modalProps = {
    id: `edit_featured_release_${release._id}`,
    label: `edit_featured_release_label_${release._id}`,
    title: 'EDIT FEATURED RELEASE',
    buttonText: uploading
      ? `Uploading... ${String(uploadProgress).replace('0', 'O')}%`
      : 'Edit',
  };

  const EditButton = () => (
    <button
      data-bs-toggle='modal'
      data-bs-target={`#${modalProps.id}`}
      className='btn btn-sm btn-dark align-middle'
      type='button'
      disabled={uploading}
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
        fields={featuredReleaseFields(release)}
        onSubmit={onSubmit}
      />
    </CustomModal>
  );
};

const DeleteFeaturedRelease = ({ release, onDelete }) => {
  const modalProps = {
    id: `del_featured_release_${release._id}`,
    label: `del_featured_release_label_${release._id}`,
    title: 'DELETE FEATURED RELEASE',
  };

  const ModalContent = () => (
    <>
      <div className='modal-body deleteItem'>Remove featured release?</div>
      <div className='modal-footer'>
        <button
          type='button'
          className='btn btn-dark'
          data-bs-dismiss='modal'
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (release.coverImage) {
              try {
                await deleteImageFromFirebase(release.coverImage);
              } catch (error) {}
            }
            onDelete(release._id);
          }}
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

const FeaturedReleasesEdit = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/featuredReleases');
      setReleases(res.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const addRelease = async fields => {
    await axios.post('/api/featuredReleases', fields);
    fetchReleases();
  };

  const editRelease = async (id, fields) => {
    await axios.put(`/api/featuredReleases/${id}`, fields);
    fetchReleases();
  };

  const deleteRelease = async id => {
    await axios.delete(`/api/featuredReleases/${id}`);
    fetchReleases();
  };

  return (
    <div
      id='featuredReleasesEdit'
      className='mb-4 container'
    >
      <hr />
      <h3>Featured Releases</h3>
      <AddFeaturedRelease onAdd={addRelease} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <VideoContainer>
          {releases.length === 0 && (
            <h3 className='no-content'>No Featured Releases</h3>
          )}
          {releases.map(release => (
            <div
              key={release._id}
              className='vid-container'
            >
              <img
                src={release.coverImage}
                alt={release.title}
                style={{
                  width: '100%',
                  maxWidth: 300,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
              <div className='mb-2'>
                <div className='video-title'>{release.title}</div>
                <div className='video-desc'>
                  {release.type} &middot;{' '}
                  {new Date(release.releaseDate).toLocaleDateString()}
                </div>
              </div>
              <div className='buttons d-grid gap-1'>
                <EditFeaturedRelease
                  release={release}
                  onEdit={editRelease}
                />
                <DeleteFeaturedRelease
                  release={release}
                  onDelete={deleteRelease}
                />
              </div>
            </div>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

export default FeaturedReleasesEdit;
