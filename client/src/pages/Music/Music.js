import 'bootstrap/dist/js/bootstrap.bundle';
import './Music.css';

import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import { fetchPlayers, fetchContactInfo } from '../../redux/actions';
import { connect } from 'react-redux';
import {
  AppleMusic,
  SoundCloud,
  YouTube,
  Spotify,
} from '../../components/icons';
import { Divider, NoContent } from '../../components/Header';
import StaticAlert from '../../components/Alert/StaticAlert';

const MusicPage = ({
  fetchPlayers,
  fetchContactInfo,
  players,
  contactInfo,
  theme,
  loading,
  error,
}) => {
  useEffect(() => {
    fetchPlayers();
    fetchContactInfo();
  }, [fetchPlayers, fetchContactInfo]);

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
            style={{ 'border-radius': '12px' }}
            src={spotifyEmbedLink}
            width='100%'
            height='390px'
            allowfullscreen=''
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
          ></iframe>

          <Divider />

          {/* Music platform icons */}
          <div className='music-platform-icons mt-3 d-flex justify-content-center gap-3'>
            {contactInfo?.spotify && (
              <a
                href={contactInfo.spotify}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <Spotify style={theme?.socialMediaIconStyle || 'default'} />
              </a>
            )}
            {contactInfo?.appleMusic && (
              <a
                href={contactInfo.appleMusic}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <AppleMusic style={theme?.socialMediaIconStyle || 'default'} />
              </a>
            )}
            {contactInfo?.soundCloud && (
              <a
                href={contactInfo.soundCloud}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <SoundCloud style={theme?.socialMediaIconStyle || 'default'} />
              </a>
            )}
            {contactInfo?.youtube && (
              <a
                href={contactInfo.youtube}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <YouTube style={theme?.socialMediaIconStyle || 'default'} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Show loading state while fetching players */}
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
      ) : error ? (
        <StaticAlert
          type={error.severity}
          title={error.title}
          description={error.message}
        />
      ) : players && players.length > 0 ? (
        players.map(player => (
          <div key={player._id}>
            <SecondaryNav label={player.title} />
            <div className='audioPlayer container'>
              <div className='player-container'>
                <iframe
                  title={player.title}
                  style={{ 'border-radius': '12px' }}
                  src={player.embedLink}
                  width='100%'
                  height='360px'
                  allowfullscreen=''
                  allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                  loading='lazy'
                ></iframe>
              </div>
              {(player.spotifyLink ||
                player.appleMusicLink ||
                player.soundcloudLink ||
                player.youtubeLink) && <Divider className='w-100 mt-3' />}
              <div className='music-platform-icons mt-3 d-flex justify-content-center gap-3'>
                {player.spotifyLink && (
                  <a
                    href={player.spotifyLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <Spotify style={theme?.socialMediaIconStyle || 'default'} />
                  </a>
                )}
                {player.appleMusicLink && (
                  <a
                    href={player.appleMusicLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <AppleMusic
                      style={theme?.socialMediaIconStyle || 'default'}
                    />
                  </a>
                )}
                {player.soundcloudLink && (
                  <a
                    href={player.soundcloudLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <SoundCloud
                      style={theme?.socialMediaIconStyle || 'default'}
                    />
                  </a>
                )}
                {player.youtubeLink && (
                  <a
                    href={player.youtubeLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <YouTube style={theme?.socialMediaIconStyle || 'default'} />
                  </a>
                )}
              </div>
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
};

function mapStateToProps({ music, contactInfo, theme }) {
  return {
    players: music?.data || [],
    contactInfo: contactInfo?.data || {},
    theme: theme?.data || null,
    loading: music?.loading || false,
    error: music?.error || null,
  };
}

export default connect(mapStateToProps, { fetchPlayers, fetchContactInfo })(
  MusicPage
);
