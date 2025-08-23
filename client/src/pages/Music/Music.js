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

const MusicPage = ({
  fetchPlayers,
  fetchContactInfo,
  players,
  contactInfo,
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

  const spotifyEmbedLink = contactInfo?.[0]?.spotify
    ? getSpotifyEmbedLink(contactInfo[0].spotify)
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
            {contactInfo?.[0]?.spotify && (
              <a
                href={contactInfo[0].spotify}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <Spotify />
              </a>
            )}
            {contactInfo?.[0]?.appleMusic && (
              <a
                href={contactInfo[0].appleMusic}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <AppleMusic />
              </a>
            )}
            {contactInfo?.[0]?.soundcloud && (
              <a
                href={contactInfo[0].soundcloud}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <SoundCloud />
              </a>
            )}
            {contactInfo?.[0]?.youtube && (
              <a
                href={contactInfo[0].youtube}
                target='_blank'
                rel='noreferrer'
                className='hvr-grow'
              >
                <YouTube />
              </a>
            )}
          </div>
        </div>
      )}

      {players && players.length > 0 ? (
        players.map(player => (
          <div key={player._id}>
            <SecondaryNav label={player.title} />
            <div className='audioPlayer container'>
              <iframe
                style={{ 'border-radius': '12px' }}
                src={player.embedLink}
                width='100%'
                height='360px'
                allowfullscreen=''
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
                title={player.title}
              ></iframe>

              {/* Music platform icons for individual players */}
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
                    <Spotify />
                  </a>
                )}
                {player.appleMusicLink && (
                  <a
                    href={player.appleMusicLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <AppleMusic />
                  </a>
                )}
                {player.soundcloudLink && (
                  <a
                    href={player.soundcloudLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <SoundCloud />
                  </a>
                )}
                {player.youtubeLink && (
                  <a
                    href={player.youtubeLink}
                    target='_blank'
                    rel='noreferrer'
                    className='hvr-grow'
                  >
                    <YouTube />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <NoContent>No music yet... Check back soon!</NoContent>
      )}
    </div>
  );
};

function mapStateToProps({ music, contactInfo }) {
  return {
    players: music?.data || [],
    contactInfo: contactInfo?.data || [],
  };
}

export default connect(mapStateToProps, { fetchPlayers, fetchContactInfo })(
  MusicPage
);
