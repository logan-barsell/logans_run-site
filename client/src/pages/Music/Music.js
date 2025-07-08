import 'bootstrap/dist/js/bootstrap.bundle';
import './Music.css';

import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import { fetchPlayers, fetchContactInfo } from '../../redux/actions';
import { connect } from 'react-redux';

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

  const spotifyEmbedLink = contactInfo[0]?.spotify
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
        </div>
      )}

      {players.length > 0 ? (
        players?.map(player => (
          <div>
            <SecondaryNav label={player.title} />
            <div className='audioPlayer container'>
              <iframe
                style={{ 'border-radius': '12px' }}
                src={player.embedLink}
                width='100%'
                height='390px'
                allowfullscreen=''
                allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                loading='lazy'
                title={player.title}
              ></iframe>
            </div>
          </div>
        ))
      ) : (
        <h3
          id='no_content'
          className='no-content'
        >
          No music yet... Check back soon!
        </h3>
      )}
    </div>
  );
};

function mapStateToProps({ music, contactInfo }) {
  return { players: music, contactInfo };
}

export default connect(mapStateToProps, { fetchPlayers, fetchContactInfo })(
  MusicPage
);
