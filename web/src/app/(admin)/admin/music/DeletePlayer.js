'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import DeleteItem from '../../../../components/Modifiers/DeleteItem';
import { deletePlayer } from '../../../../services/musicService';
import { fetchPlayers } from '../../../../redux/actions';
import { useAlert } from '../../../../contexts/AlertContext';

const DeletePlayer = ({ player }) => {
  const dispatch = useDispatch();
  const { showError, showSuccess } = useAlert();

  const onDelete = async () => {
    try {
      await deletePlayer(player.id);
      dispatch(fetchPlayers());
      showSuccess('Music player deleted successfully!');
    } catch (err) {
      showError(err.message || 'Failed to delete music player');
    }
  };

  return (
    <DeleteItem
      item={player}
      onDelete={onDelete}
      variant='wide'
      title='DELETE MUSIC'
      content={
        <>
          Remove <span>{player.title}</span> from music?
        </>
      }
      modalProps={{
        id: `del_player_${player.id}`,
        label: `del_player_label_${player.id}`,
      }}
      buttonText='Remove'
      confirmText={`Remove ${player.title} from music?`}
    />
  );
};

export default DeletePlayer;
