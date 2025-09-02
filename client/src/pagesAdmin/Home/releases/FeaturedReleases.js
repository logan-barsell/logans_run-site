import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import VideoContainer from '../../../components/Video/VideoContainer';
import './featuredReleases.css';
import { fetchFeaturedReleases } from '../../../redux/actions';
import { useAlert } from '../../../contexts/AlertContext';
import AddFeaturedRelease from './AddFeaturedRelease';
import EditFeaturedRelease from './EditFeaturedRelease';
import DeleteFeaturedRelease from './DeleteFeaturedRelease';
import { PageTitle, NoContent } from '../../../components/Header';

const FeaturedReleasesEdit = ({ fetchFeaturedReleases, featuredReleases }) => {
  const { showError } = useAlert();
  const { data: releases, loading, error } = featuredReleases;

  useEffect(() => {
    fetchFeaturedReleases();
  }, [fetchFeaturedReleases]);

  // Handle errors from Redux state
  useEffect(() => {
    if (error) {
      showError('Failed to load featured releases');
    }
  }, [error, showError]);

  return (
    <div
      id='featuredReleasesEdit'
      className='mb-4 container'
    >
      <PageTitle divider>Featured Releases</PageTitle>
      <AddFeaturedRelease fetchReleases={fetchFeaturedReleases} />
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
      ) : (
        <VideoContainer>
          {releases.length === 0 && <NoContent>No Featured Releases</NoContent>}
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
                  fetchReleases={fetchFeaturedReleases}
                />
                <DeleteFeaturedRelease
                  release={release}
                  fetchReleases={fetchFeaturedReleases}
                />
              </div>
            </div>
          ))}
        </VideoContainer>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  featuredReleases: state.featuredReleases,
});

const mapDispatchToProps = {
  fetchFeaturedReleases,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeaturedReleasesEdit);
