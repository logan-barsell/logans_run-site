const SpotifyPlayer = require('../models/SpotifyPlayer');
const NewsletterService = require('./newsletterService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

// Spotify URL validation patterns
const SPOTIFY_PATTERNS = {
  track: /^https?:\/\/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})/,
  album: /^https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]{22})/,
  playlist: /^https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]{22})/,
};

const SUPPORTED_TYPES = ['track', 'album', 'playlist'];

/**
 * Validate Spotify URL
 */
function validateSpotifyUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new AppError('URL is required and must be a string', 400);
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    throw new AppError('URL cannot be empty', 400);
  }

  try {
    new URL(trimmedUrl);
  } catch (error) {
    throw new AppError('Invalid URL format', 400);
  }

  for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      if (!SUPPORTED_TYPES.includes(type)) {
        throw new AppError(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } URLs are not supported for embedding`,
          400
        );
      }
      return { isValid: true, type, id: match[1] };
    }
  }

  throw new AppError(
    'Not a valid Spotify URL. Must be a track, album, or playlist URL',
    400
  );
}

/**
 * Add a new Spotify player
 */
async function addPlayer(playerData) {
  try {
    if (!playerData || Object.keys(playerData).length === 0) {
      throw new AppError('Player data is required', 400);
    }

    const { spotifyLink } = playerData;

    // Validate Spotify URL
    validateSpotifyUrl(spotifyLink);

    const newPlayer = new SpotifyPlayer(playerData);
    await newPlayer.save();

    logger.info('✅ New Spotify player added successfully');

    // Send newsletter notification for new music
    try {
      await NewsletterService.sendContentNotification('music', {
        title: newPlayer.title || 'New Music',
        artist: newPlayer.artist,
        album: newPlayer.album,
        description: `New music: ${newPlayer.title || 'New track'}`,
      });
    } catch (notificationError) {
      logger.error(
        'Failed to send newsletter notification:',
        notificationError
      );
      // Don't fail the music creation if newsletter fails
    }

    return newPlayer;
  } catch (error) {
    logger.error('❌ Error adding Spotify player:', error);
    throw new AppError(
      error.message || 'Error adding Spotify player',
      error.statusCode || 500
    );
  }
}

/**
 * Update a Spotify player
 */
async function updatePlayer(playerData) {
  try {
    if (!playerData || !playerData._id) {
      throw new AppError('Player data and ID are required', 400);
    }

    const { spotifyLink } = playerData;

    // Validate Spotify URL if it's being updated
    if (spotifyLink) {
      validateSpotifyUrl(spotifyLink);
    }

    const updatedPlayer = await SpotifyPlayer.findByIdAndUpdate(
      playerData._id,
      playerData,
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      throw new AppError('Player not found', 404);
    }

    logger.info(`✅ Spotify player updated successfully: ${playerData._id}`);
    return updatedPlayer;
  } catch (error) {
    logger.error('❌ Error updating Spotify player:', error);
    throw new AppError(
      error.message || 'Error updating Spotify player',
      error.statusCode || 500
    );
  }
}

/**
 * Delete a Spotify player by ID
 */
async function deletePlayer(id) {
  try {
    if (!id) {
      throw new AppError('Player ID is required', 400);
    }

    const deletedPlayer = await SpotifyPlayer.findByIdAndDelete(id);

    if (!deletedPlayer) {
      throw new AppError('Player not found', 404);
    }

    logger.info(`✅ Spotify player deleted successfully: ${id}`);
    return deletedPlayer;
  } catch (error) {
    logger.error('❌ Error deleting Spotify player:', error);
    throw new AppError(
      error.message || 'Error deleting Spotify player',
      error.statusCode || 500
    );
  }
}

/**
 * Get a Spotify player by ID
 */
async function getPlayer(id) {
  try {
    if (!id) {
      throw new AppError('Player ID is required', 400);
    }

    const player = await SpotifyPlayer.findById(id);

    if (!player) {
      throw new AppError('Player not found', 404);
    }

    return player;
  } catch (error) {
    logger.error('❌ Error fetching Spotify player:', error);
    throw new AppError(
      error.message || 'Error fetching Spotify player',
      error.statusCode || 500
    );
  }
}

/**
 * Get all Spotify players
 */
async function getPlayers() {
  try {
    const players = await SpotifyPlayer.find().sort({ createdAt: -1 });
    return players;
  } catch (error) {
    logger.error('❌ Error fetching Spotify players:', error);
    throw new AppError(
      error.message || 'Error fetching Spotify players',
      error.statusCode || 500
    );
  }
}

module.exports = {
  addPlayer,
  updatePlayer,
  deletePlayer,
  getPlayer,
  getPlayers,
};
