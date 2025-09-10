const { withTenant } = require('../db/withTenant');
const NewsletterService = require('./newsletterService');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');
const {
  validateSpotifyUrl,
  extractMusicType,
} = require('../utils/spotifyValidation');
const { whitelistFields } = require('../utils/fieldWhitelist');

// Spotify player allowed fields
const SPOTIFY_PLAYER_FIELDS = [
  'title',
  'date',
  'bgColor',
  'spotifyLink',
  'embedLink',
  'appleMusicLink',
  'youtubeLink',
  'soundcloudLink',
];

/**
 * Add a new Spotify player
 */
async function addPlayer(tenantId, playerData) {
  try {
    if (!playerData || Object.keys(playerData).length === 0) {
      throw new AppError('Player data is required', 400);
    }

    const { spotifyLink } = playerData;

    // Validate Spotify URL
    validateSpotifyUrl(spotifyLink);

    // Whitelist allowed fields
    const filteredData = whitelistFields(playerData, SPOTIFY_PLAYER_FIELDS);

    const newPlayer = await withTenant(tenantId, async tx => {
      return await tx.spotifyPlayer.create({
        data: {
          ...filteredData,
          tenantId,
        },
      });
    });

    logger.info('✅ New Spotify player added successfully');

    // Send newsletter notification for new music
    try {
      const musicType = extractMusicType(newPlayer.spotifyLink);

      await NewsletterService.sendContentNotification(tenantId, 'music', {
        title: newPlayer.title || 'New Music',
        type: musicType,
        releaseDate: newPlayer.date,
        spotifyLink: newPlayer.spotifyLink,
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
async function updatePlayer(tenantId, playerData) {
  try {
    if (!playerData || !playerData.id) {
      throw new AppError('Player data and ID are required', 400);
    }

    const { spotifyLink, id } = playerData;

    // Validate Spotify URL if it's being updated
    if (spotifyLink) {
      validateSpotifyUrl(spotifyLink);
    }

    // Whitelist allowed fields
    const filteredData = whitelistFields(playerData, SPOTIFY_PLAYER_FIELDS);

    const updatedPlayer = await withTenant(tenantId, async tx => {
      const existing = await tx.spotifyPlayer.findUnique({
        where: {
          id,
          tenantId,
        },
      });
      if (!existing) throw new AppError('Player not found', 404);

      return await tx.spotifyPlayer.update({
        where: {
          id,
          tenantId,
        },
        data: filteredData,
      });
    });

    logger.info(`✅ Spotify player updated successfully: ${id}`);
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
async function deletePlayer(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Player ID is required', 400);
    }

    await withTenant(tenantId, async tx => {
      const existing = await tx.spotifyPlayer.findUnique({
        where: {
          id,
          tenantId,
        },
      });
      if (!existing) throw new AppError('Player not found', 404);

      await tx.spotifyPlayer.delete({
        where: {
          id,
          tenantId,
        },
      });
    });

    logger.info(`✅ Spotify player deleted successfully: ${id}`);
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
async function getPlayer(tenantId, id) {
  try {
    if (!id) {
      throw new AppError('Player ID is required', 400);
    }

    const player = await withTenant(tenantId, async tx => {
      return await tx.spotifyPlayer.findUnique({
        where: {
          id,
          tenantId,
        },
      });
    });

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
async function getPlayers(tenantId) {
  try {
    const players = await withTenant(tenantId, async tx => {
      return await tx.spotifyPlayer.findMany({
        where: {
          tenantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

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
