import 'bootstrap/dist/js/bootstrap.bundle';
import './Music.css';

import React, { useEffect } from 'react';
import SecondaryNav from '../../components/Navbar/SecondaryNav';
import { fetchPlayers } from '../../redux/actions';
import { connect } from 'react-redux';

const MusicPage = ({ fetchPlayers, players }) => {
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return (
    <div
      id='music'
      className='fadeIn'
    >
      <div className='audioPlayer mainAudioPlayer container'>
        <iframe
          title='123'
          style={{ 'border-radius': '12px' }}
          src='https://open.spotify.com/embed/artist/0b8AbfdNkOFy9tYFuWMf13?utm_source=generator'
          width='100%'
          height='390px'
          allowfullscreen=''
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
        ></iframe>
      </div>

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

function mapStateToProps({ music }) {
  return { players: music };
}

export default connect(mapStateToProps, { fetchPlayers })(MusicPage);
