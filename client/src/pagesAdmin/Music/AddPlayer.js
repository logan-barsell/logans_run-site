import React from 'react';
import ModalForm from '../../components/Forms/ModalForm';
import CustomModal from '../../components/Bootstrap/CustomModal';
import { fetchPlayers } from '../../redux/actions';
import { connect } from 'react-redux';
import { addPlayer } from '../../services/musicPlayersService';
import { useAlert } from '../../contexts/AlertContext';

const AddPlayer = ({ fetchPlayers }) => {
  const { showError, showSuccess } = useAlert();

  const fields = [
    {
      label: 'Background Color',
      name: 'bgColor',
      type: 'options',
      options: [
        { name: 'Gray', value: '&theme=0' },
        { name: 'Red', value: '' },
      ],
      initialValue: '&theme=0',
    },
    { label: 'Title', name: 'title', type: 'text' },
    { label: 'Release Date', name: 'date', type: 'date' },
    { label: 'Spotify Link', name: 'spotifyLink', type: 'text' },
    { label: 'Apple Music Link', name: 'appleMusicLink', type: 'text' },
    { label: 'YouTube Link', name: 'youtubeLink', type: 'text' },
    { label: 'SoundCloud Link', name: 'soundcloudLink', type: 'text' },
  ];

  const onSubmit = async ({
    bgColor,
    title,
    date,
    spotifyLink,
    appleMusicLink,
    youtubeLink,
    soundcloudLink,
  }) => {
    try {
      const path = new URL(spotifyLink).pathname;
      const theme = bgColor ? bgColor : '';
      const embedLink = `https://open.spotify.com/embed${path}?utm_source=generator${theme}`;
      const newPlayer = {
        title,
        date: date.getTime(),
        bgColor,
        spotifyLink,
        embedLink,
        appleMusicLink,
        youtubeLink,
        soundcloudLink,
      };

      await addPlayer(newPlayer);
      fetchPlayers();
      showSuccess('Music player added successfully!');
    } catch (err) {
      showError(err.message || 'Failed to add music player');
    }
  };

  const modalProps = {
    id: 'add_player',
    label: 'add_player',
    title: 'NEW MUSIC',
    buttonText: 'Add Music',
  };

  const AddButton = () => {
    return (
      <button
        data-bs-toggle='modal'
        data-bs-target={`#${modalProps.id}`}
        className='addButton btn btn-danger'
        type='button'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='currentColor'
          className='bi bi-plus-square-fill'
          viewBox='0 0 16 16'
        >
          <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z' />
        </svg>
        {modalProps.buttonText}
      </button>
    );
  };

  return (
    <>
      <CustomModal
        modalProps={modalProps}
        modalButton={<AddButton />}
      >
        <ModalForm
          fields={fields}
          onSubmit={onSubmit}
        />
      </CustomModal>
    </>
  );
};

function mapStateToProps({ music }) {
  return { players: music };
}

export default connect(mapStateToProps, { fetchPlayers })(AddPlayer);
