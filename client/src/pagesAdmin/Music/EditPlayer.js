import React from 'react';
import { useDispatch } from 'react-redux';
import EditItem from '../../components/Modifiers/EditItem';
import { editPlayerFields } from './constants';
import { updatePlayer } from '../../services/musicService';
import { fetchPlayers } from '../../redux/actions';
import { useAlert } from '../../contexts/AlertContext';
import { validateSpotifyUrl } from '../../utils/validation';
import { generateSpotifyEmbedUrl } from '../../utils/validation/spotifyValidation';

const EditPlayer = ({ player }) => {
  const dispatch = useDispatch();
  const { showError, showSuccess } = useAlert();

  const onEdit = async fields => {
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

      const updatedPlayer = {
        ...fields,
        id: player.id,
        embedLink,
      };

      await updatePlayer(updatedPlayer);
      dispatch(fetchPlayers());
      showSuccess('Music player updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update music player');
    }
  };

  return (
    <EditItem
      item={player}
      editFields={editPlayerFields}
      onEdit={onEdit}
      variant='wide'
      title='EDIT MUSIC'
      modalProps={{
        id: `edit_player_${player.id}`,
        label: `edit_player_label_${player.id}`,
      }}
    />
  );
};

export default EditPlayer;
