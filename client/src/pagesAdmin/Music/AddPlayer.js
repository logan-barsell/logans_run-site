import React from 'react';
import { connect } from 'react-redux';
import { fetchPlayers } from '../../redux/actions';
import ModalForm from '../../components/Forms/ModalForm';
import { validateSpotifyUrl } from '../../utils/validation';
import { generateSpotifyEmbedUrl } from '../../utils/validation/spotifyValidation';
import { addPlayer } from '../../services/musicService';
import { useAlert } from '../../contexts/AlertContext';
import AddItem from '../../components/Modifiers/AddItem';
import { ADD_PLAYER_FIELDS } from './constants';
import Button from '../../components/Button/Button';
import { PlusSquareFill } from '../../components/icons';

const AddPlayer = ({ fetchPlayers }) => {
  const { showError, showSuccess } = useAlert();

  const onAdd = async fields => {
    try {
      // Validate Spotify URL
      const spotifyValidation = validateSpotifyUrl(fields.spotifyLink);
      if (!spotifyValidation.isValid) {
        showError(spotifyValidation.error);
        return;
      }

      // Generate embed URL
      const embedLink = generateSpotifyEmbedUrl(
        fields.spotifyLink,
        fields.bgColor
      );
      if (!embedLink) {
        showError('Failed to generate Spotify embed URL');
        return;
      }

      const newPlayer = {
        ...fields,
        date: fields.date?.getTime?.() || fields.date,
        embedLink,
      };

      await addPlayer(newPlayer);
      fetchPlayers();
      showSuccess('Music player added successfully!');
    } catch (err) {
      showError(err.message || 'Failed to add music player');
    }
  };

  return (
    <AddItem
      fields={ADD_PLAYER_FIELDS}
      onAdd={onAdd}
      title='NEW MUSIC'
      modalProps={{ id: 'add_player', label: 'add_player' }}
      modalButton={
        <Button
          variant='danger'
          icon={<PlusSquareFill />}
          type='button'
          className='addButton'
        >
          Add Music
        </Button>
      }
    />
  );
};

function mapStateToProps({ music }) {
  return { players: music };
}

export default connect(mapStateToProps, { fetchPlayers })(AddPlayer);
