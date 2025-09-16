import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeaturedReleases } from '../../../../../redux/actions';
import FeaturedReleasesCarousel from '../../../../../components/Carousels/FeaturedReleasesCarousel';
import { PageTitle } from '../../../../../components/Header';
import StaticAlert from '../../../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../../../components/LoadingSpinner';

export default function FeaturedReleasesSection() {
  const dispatch = useDispatch();
  const featuredReleases = useSelector(
    state => state.featuredReleases?.data || []
  );
  const loading = useSelector(
    state => state.featuredReleases?.loading || false
  );
  const error = useSelector(state => state.featuredReleases?.error || null);

  useEffect(() => {
    dispatch(fetchFeaturedReleases());
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return <PageLoader />;
  }

  // Show error state
  if (error) {
    return (
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  // Show releases if we have any
  if (featuredReleases.length > 0) {
    return (
      <>
        <PageTitle
          divider
          color='white'
          className='secondary-font'
        >
          New Releases
        </PageTitle>
        <FeaturedReleasesCarousel releases={featuredReleases} />
      </>
    );
  }

  // No releases available
  return null;
}
