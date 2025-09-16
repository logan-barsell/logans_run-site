'use client';

import './Bio.css';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBio, fetchMembers } from '../../../redux/actions';
import { useTheme } from '../../../contexts/ThemeContext';
import { PageTitle, Divider } from '../../../components/Header';
import StaticAlert from '../../../components/Alert/StaticAlert';
import { PageLoader } from '../../../components/LoadingSpinner';
import SecondaryNav from '../../../components/Navbar/SecondaryNav/SecondaryNav';
import SocialIcons from '../../../components/SocialIcons';

export default function BioPage() {
  const dispatch = useDispatch();
  const bio = useSelector(state => state.currentBio?.data);
  const members = useSelector(state => state.members?.data);
  const theme = useSelector(state => state.theme?.data || null);
  const membersLoading = useSelector(state => state.members?.loading || false);
  const membersError = useSelector(state => state.members?.error || null);
  const bioLoading = useSelector(state => state.currentBio?.loading || false);
  const bioError = useSelector(state => state.currentBio?.error || null);

  const { theme: themeContext } = useTheme();

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchBio());
  }, [dispatch]);

  // Show loading state while fetching data
  if (membersLoading || bioLoading) {
    return <PageLoader />;
  }

  // Show error state if fetch failed
  if (membersError || bioError) {
    const error = membersError || bioError;
    return (
      <div
        id='aboutus'
        className='fadeIn'
      >
        <div className='text-center py-5'>
          <StaticAlert
            type={error.severity}
            title={error.title}
            description={error.message}
          />
        </div>
      </div>
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
    const links = {
      facebook: member.facebook,
      instagram: member.instagram,
      tiktok: member.tiktok,
      youtube: member.youtube,
      x: member.x,
    };

    return (
      <SocialIcons
        links={links}
        variant='member'
        theme={theme}
        className='mb-2'
      />
    );
  };

  const renderMembers = (members || []).map((member, index) => {
    const { id, bioPic, name, role } = member;

    return (
      <div key={id}>
        {index === 0 ? null : <Divider />}
        <div className='row justify-content-center mb-5 mt-4 mx-1 gap-4'>
          <div className='col-12 col-md-5 bioPic'>
            <Image
              src={bioPic}
              alt={`${name}: ${role}`}
              width={300}
              height={300}
              style={{ width: 'auto' }}
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
                <Image
                  className='aboutuspic'
                  src={bio[0].customImageUrl}
                  alt='Bio'
                  width={400}
                  height={300}
                  style={{ height: 'auto' }}
                />
              ) : (
                <Image
                  className='aboutuspic'
                  src={theme?.bandLogoUrl}
                  alt='Band Logo'
                  width={400}
                  height={300}
                  style={{ height: 'auto' }}
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
}
