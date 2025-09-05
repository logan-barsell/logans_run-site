import './Bio.css';
import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import { connect } from 'react-redux';
import { fetchBio, fetchMembers } from '../../redux/actions';
import { useTheme } from '../../contexts/ThemeContext';
import { PageTitle, Divider, NoContent } from '../../components/Header';
import StaticAlert from '../../components/Alert/StaticAlert';

import {
  Facebook,
  Instagram,
  TikTok,
  YouTube,
  X as XIcon,
} from '../../components/icons';

const BioPage = ({
  fetchMembers,
  members,
  fetchBio,
  bio,
  membersLoading,
  membersError,
  bioLoading,
  bioError,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    fetchMembers();
    fetchBio();
  }, [fetchMembers, fetchBio]);

  // Show loading state while fetching data
  if (membersLoading || bioLoading) {
    return (
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
    );
  }

  // Show error state if fetch failed
  if (membersError || bioError) {
    const error = membersError || bioError;
    return (
      <StaticAlert
        type={error.severity}
        title={error.title}
        description={error.message}
      />
    );
  }

  const renderBio = () => {
    // If there's custom bio text, use it
    if (bio && bio[0]?.text) {
      return bio[0].text;
    }

    // Otherwise, show a generic fallback message using the band name
    const bandName = theme?.siteTitle || theme?.greeting;
    if (bandName) {
      return `Thanks for visiting the official ${bandName} site. We're excited to share our music and connect with fans like you. Stay tuned for updates on our latest releases, upcoming shows, and behind-the-scenes content.`;
    } else {
      return `Thanks for visiting our band site. We're excited to share our music and connect with fans like you. Stay tuned for updates on our latest releases, upcoming shows, and behind-the-scenes content.`;
    }
  };

  const renderSocialIcons = member => {
    const icons = [];
    if (member.facebook)
      icons.push(
        <a
          key='facebook'
          href={member.facebook}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Facebook style={theme?.socialMediaIconStyle || 'default'} />{' '}
        </a>
      );
    if (member.instagram)
      icons.push(
        <a
          key='instagram'
          href={member.instagram}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <Instagram style={theme?.socialMediaIconStyle || 'default'} />{' '}
        </a>
      );
    if (member.tiktok)
      icons.push(
        <a
          key='tiktok'
          href={member.tiktok}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <TikTok style={theme?.socialMediaIconStyle || 'default'} />{' '}
        </a>
      );
    if (member.youtube)
      icons.push(
        <a
          key='youtube'
          href={member.youtube}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <YouTube style={theme?.socialMediaIconStyle || 'default'} />{' '}
        </a>
      );
    if (member.x)
      icons.push(
        <a
          key='x'
          href={member.x}
          target='_blank'
          rel='noreferrer'
          className='mx-1'
        >
          {' '}
          <XIcon style={theme?.socialMediaIconStyle || 'default'} />{' '}
        </a>
      );
    if (!icons.length) return null;
    return (
      <div className='member-social-icons d-flex justify-content-center mb-2'>
        {icons}
      </div>
    );
  };

  const renderMembers = (members || []).map((member, index) => {
    const { _id, bioPic, name, role } = member;

    return (
      <div key={_id}>
        {index === 0 ? null : <Divider />}
        <div className='row justify-content-center mb-5 mt-4 mx-1 gap-4'>
          <div className='col-12 col-md-5 bioPic'>
            <img
              src={bioPic}
              alt={`${name}: ${role}`}
            />
          </div>
          <div className='col-12 col-md-6 ind-bio'>
            <div className='row'>
              <PageTitle
                as='h3'
                className='mb-0'
                marginClass='mb-3'
              >
                {name}
              </PageTitle>
              <Divider />
              <p>{role}</p>
              {renderSocialIcons(member)}
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      id='aboutus'
      className='fadeIn'
    >
      <div>
        <div
          id='biography'
          className='container'
        >
          <div className='row justify-content-center'>
            <div className='col-7 col-sm-auto'>
              {bio &&
              bio[0]?.imageType === 'custom-image' &&
              bio[0]?.customImageUrl ? (
                <img
                  className='aboutuspic'
                  src={bio[0].customImageUrl}
                  alt='Bio'
                  style={{
                    borderRadius: '5px',
                  }}
                />
              ) : (
                <img
                  className='aboutuspic'
                  src={theme?.bandLogoUrl}
                  alt='Band Logo'
                />
              )}
            </div>
          </div>

          <div className='row justify-content-center bio'>
            <p>{renderBio()}</p>
          </div>
        </div>

        {members && members.length ? (
          <div className='members'>
            <SecondaryNav label='Members' />
            <br />
            <div className='container pb-5'>{renderMembers}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function mapStateToProps({ currentBio, members, theme }) {
  return {
    bio: currentBio?.data || [],
    members: members?.data || [],
    theme: theme?.data || null,
    membersLoading: members?.loading || false,
    membersError: members?.error || null,
    bioLoading: currentBio?.loading || false,
    bioError: currentBio?.error || null,
  };
}

export default connect(mapStateToProps, { fetchMembers, fetchBio })(BioPage);
