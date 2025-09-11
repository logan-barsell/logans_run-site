import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchFeaturedReleases } from '../../../../redux/actions';
import FeaturedReleasesCarousel from '../../../../components/Carousels/FeaturedReleasesCarousel';
import { PageTitle } from '../../../../components/Header';
import StaticAlert from '../../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../../components/LoadingSpinner';

const FeaturedReleasesSection = ({
  fetchFeaturedReleases,
  featuredReleases,
  loading,
  error,
}) => {
  useEffect(() => {
    fetchFeaturedReleases();
  }, [fetchFeaturedReleases]);

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
};

function mapStateToProps({ featuredReleases }) {
  return {
    featuredReleases: featuredReleases?.data || [],
    loading: featuredReleases?.loading || false,
    error: featuredReleases?.error || null,
  };
}

export default connect(mapStateToProps, { fetchFeaturedReleases })(
  FeaturedReleasesSection
);
