import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchFeaturedReleases } from '../../../../redux/actions';
import FeaturedReleasesCarousel from '../../../../components/Carousels/FeaturedReleasesCarousel';
import { PageTitle } from '../../../../components/Header';
import StaticAlert from '../../../../components/Alert/StaticAlert';

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
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <div
          className='spinner-border text-light'
          role='status'
        >
          <span className='visually-hidden'>Loading releases...</span>
        </div>
      </div>
    );
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
