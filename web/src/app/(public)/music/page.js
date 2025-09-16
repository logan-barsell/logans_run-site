'use client';

import 'bootstrap/dist/js/bootstrap.bundle';
import './Music.css';

import React, { useEffect } from 'react';
import SecondaryNav from '../../../components/Navbar/SecondaryNav/SecondaryNav';
import { fetchPlayers, fetchContactInfo } from '../../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import SocialIcons from '../../../components/SocialIcons';
import { Divider, NoContent } from '../../../components/Header';
import StaticAlert from '../../../components/Alert/StaticAlert';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function MusicPage() {
  const dispatch = useDispatch();
  const players = useSelector(state => state.music?.data || []);
  const contactInfo = useSelector(state => state.contactInfo?.data || {});
  const theme = useSelector(state => state.theme?.data || null);
  const loading = useSelector(state => state.music?.loading || false);
  const error = useSelector(state => state.music?.error || null);

  useEffect(() => {
    dispatch(fetchPlayers());
    dispatch(fetchContactInfo());
  }, [dispatch]);

  // Function to extract Spotify artist ID and create embed link
  const getSpotifyEmbedLink = spotifyUrl => {
    if (!spotifyUrl) return null;

    try {
      // Extract artist ID from URL like: https://open.spotify.com/artist/0b8AbfdNkOFy9tYFuWMf13?si=Y_drC3M1Tt-RQvRPTPydzg
      const url = new URL(spotifyUrl);
      const pathParts = url.pathname.split('/');
      const artistId = pathParts[2]; // artist ID is the third part after splitting by '/'

      if (artistId) {
        return `https://open.spotify.com/embed/artist/${artistId}?utm_source=generator`;
      }
    } catch (error) {
      console.error('Error parsing Spotify URL:', error);
    }

    return null;
  };

  const spotifyEmbedLink = contactInfo?.spotify
    ? getSpotifyEmbedLink(contactInfo.spotify)
    : null;

  return (
    <div
      id='music'
      className='fadeIn'
    >
      {spotifyEmbedLink && (
        <div className='audioPlayer mainAudioPlayer container'>
          <iframe
            title='Spotify Artist'
            style={{ borderRadius: '12px' }}
            src={spotifyEmbedLink}
            width='100%'
            height='390px'
            allowFullScreen=''
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
          ></iframe>

          <Divider
            className='mt-3'
            variant='white'
          />

          {/* Music platform icons */}
          <SocialIcons
            links={{
              spotify: contactInfo?.spotify,
              appleMusic: contactInfo?.appleMusic,
              soundCloud: contactInfo?.soundCloud,
              youtube: contactInfo?.youtube,
            }}
            variant='music'
            theme={theme}
          />
        </div>
      )}

      {/* Show loading state while fetching players */}
      {loading ? (
        <div className='text-center py-5'>
          <LoadingSpinner
            size='lg'
            color='white'
            centered={true}
          />
        </div>
      ) : error ? (
        <div className='text-center py-5'>
          <StaticAlert
            type={error.severity}
            title={error.title}
            description={error.message}
          />
        </div>
      ) : players && players.length > 0 ? (
        players.map(player => (
          <div key={player.id}>
            <SecondaryNav label={player.title} />
            <div className='audioPlayer container'>
              <div className='player-container'>
                <iframe
                  title={player.title}
                  style={{ borderRadius: '12px' }}
                  src={player.embedLink}
                  width='100%'
                  height='360px'
                  allowFullScreen=''
                  allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                  loading='lazy'
                ></iframe>
              </div>
              {(player.spotifyLink ||
                player.appleMusicLink ||
                player.soundcloudLink ||
                player.youtubeLink) && (
                <Divider
                  variant='white'
                  className='w-100 mt-3'
                />
              )}
              <SocialIcons
                links={{
                  spotify: player.spotifyLink,
                  appleMusic: player.appleMusicLink,
                  soundCloud: player.soundcloudLink,
                  youtube: player.youtubeLink,
                }}
                variant='music'
                theme={theme}
              />
            </div>
          </div>
        ))
      ) : (
        <div className='my-5 px-3'>
          <NoContent>No music yet... Check back soon!</NoContent>
        </div>
      )}
    </div>
  );
}
