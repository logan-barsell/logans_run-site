import React, { useEffect, useState } from 'react';
import VideoContainer from '../../../components/Video/VideoContainer';
import './featuredReleases.css';
import { getFeaturedReleases } from '../../../services/featuredContentService';
import { useAlert } from '../../../contexts/AlertContext';
import AddFeaturedRelease from './AddFeaturedRelease';
import EditFeaturedRelease from './EditFeaturedRelease';
import DeleteFeaturedRelease from './DeleteFeaturedRelease';

const FeaturedReleasesEdit = () => {
  const { showError } = useAlert();
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReleases = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFeaturedReleases();
      setReleases(data);
    } catch (err) {
      showError('Failed to load featured releases');
    }
    setLoading(false);
  }, [showError]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  return (
    <div
      id='featuredReleasesEdit'
      className='mb-4 container'
    >
      <hr />
      <h3>Featured Releases</h3>
      <AddFeaturedRelease fetchReleases={fetchReleases} />
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
                  fetchReleases={fetchReleases}
                />
                <DeleteFeaturedRelease
                  release={release}
                  fetchReleases={fetchReleases}
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
