'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import VideoContainer from '../../../../../components/Video/VideoContainer';
import './featuredReleases.css';
import { fetchFeaturedReleases } from '../../../../../redux/actions';
import { useAlert } from '../../../../../contexts/AlertContext';
import AddFeaturedRelease from './AddFeaturedRelease';
import EditFeaturedRelease from './EditFeaturedRelease';
import DeleteFeaturedRelease from './DeleteFeaturedRelease';
import { PageTitle, NoContent } from '../../../../../components/Header';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import StaticAlert from '../../../../../components/Alert/StaticAlert';

const FeaturedReleasesEdit = () => {
  const dispatch = useDispatch();
  const featuredReleases = useSelector(state => state.featuredReleases);
  const { showError, showSuccess } = useAlert();
  const { data: releases, loading, error } = featuredReleases;
  const operationSuccessfulRef = useRef(false);

  useEffect(() => {
    dispatch(fetchFeaturedReleases());
  }, [dispatch]);

  // Handle successful release operations
  const handleReleaseSuccess = message => {
    showSuccess(message);
    // Set a flag that we had a successful operation
    operationSuccessfulRef.current = true;
  };

  const handleReleaseError = error => {
    showError(error);
  };

  // Handle modal close - only refresh if operation was successful
  const handleModalClose = () => {
    if (operationSuccessfulRef.current) {
      dispatch(fetchFeaturedReleases());
      operationSuccessfulRef.current = false; // Reset flag
    }
  };

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
      <AddFeaturedRelease
        onSuccess={handleReleaseSuccess}
        onError={handleReleaseError}
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
        <VideoContainer>
          {releases.length === 0 && (
            <div className='my-4'>
              <NoContent>No Featured Releases</NoContent>
            </div>
          )}
          {releases.map(release => (
            <div
              key={release.id}
              className='vid-container'
            >
              <Image
                src={release.coverImage}
                alt={release.title}
                width={300}
                height={300}
                style={{
                  width: '100%',
                  maxWidth: 300,
                  borderRadius: 8,
                  marginBottom: 12,
                  height: 'auto',
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
                  onSuccess={handleReleaseSuccess}
                  onError={handleReleaseError}
                  onClose={handleModalClose}
                />
                <DeleteFeaturedRelease
                  release={release}
                  onSuccess={handleReleaseSuccess}
                  onError={handleReleaseError}
                  onClose={handleModalClose}
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
