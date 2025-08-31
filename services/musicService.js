const SpotifyPlayer = require('../models/SpotifyPlayer');
const NewsletterService = require('./newsletterService');
const logger = require('../utils/logger');

// Spotify URL validation patterns
const SPOTIFY_PATTERNS = {
  track: /^https?:\/\/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})/,
  album: /^https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]{22})/,
  playlist: /^https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]{22})/,
};

const SUPPORTED_TYPES = ['track', 'album', 'playlist'];

class MusicService {
  /**
   * Validate Spotify URL
   */
  validateSpotifyUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      throw new Error('URL cannot be empty');
    }

    try {
      new URL(trimmedUrl);
    } catch (error) {
      throw new Error('Invalid URL format');
    }

    for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
      const match = trimmedUrl.match(pattern);
      if (match) {
        if (!SUPPORTED_TYPES.includes(type)) {
          throw new Error(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } URLs are not supported for embedding`
          );
        }
        return { isValid: true, type, id: match[1] };
      }
    }

    throw new Error(
      'Not a valid Spotify URL. Must be a track, album, or playlist URL'
    );
  }

  /**
   * Add a new Spotify player
   */
  async addPlayer(playerData) {
    try {
      if (!playerData || Object.keys(playerData).length === 0) {
        throw new Error('Player data is required');
      }

      const { spotifyLink } = playerData;

      // Validate Spotify URL
      this.validateSpotifyUrl(spotifyLink);

      const newPlayer = new SpotifyPlayer(playerData);
      await newPlayer.save();

      logger.info('New Spotify player added successfully');

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
          'Failed to send newsletter notification for new music:',
          notificationError
        );
        // Don't throw error - music was still added successfully
      }

      return newPlayer;
    } catch (error) {
      logger.error('Error adding Spotify player:', error);
      throw error;
    }
  }

  /**
   * Update a Spotify player
   */
  async updatePlayer(playerData) {
    try {
      if (!playerData || !playerData._id) {
        throw new Error('Player data and ID are required');
      }

      const { spotifyLink } = playerData;

      // Validate Spotify URL
      this.validateSpotifyUrl(spotifyLink);

      const player = await SpotifyPlayer.findOneAndUpdate(
        { _id: playerData._id },
        playerData,
        { new: true }
      );

      if (!player) {
        throw new Error('Player not found');
      }

      logger.info(`Spotify player updated successfully: ${playerData._id}`);
      return player;
    } catch (error) {
      logger.error('Error updating Spotify player:', error);
      throw error;
    }
  }

  /**
   * Delete a Spotify player by ID
   */
  async deletePlayer(id) {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }

      const deletedPlayer = await SpotifyPlayer.findByIdAndDelete(id);

      if (!deletedPlayer) {
        throw new Error('Player not found');
      }

      logger.info(`Spotify player deleted successfully: ${id}`);
      return deletedPlayer;
    } catch (error) {
      logger.error('Error deleting Spotify player:', error);
      throw error;
    }
  }

  /**
   * Get a Spotify player by ID
   */
  async getPlayer(id) {
    try {
      if (!id) {
        throw new Error('Player ID is required');
      }

      const player = await SpotifyPlayer.findById(id);

      if (!player) {
        throw new Error('Player not found');
      }

      return player;
    } catch (error) {
      logger.error('Error fetching Spotify player:', error);
      throw error;
    }
  }

  /**
   * Get all Spotify players
   */
  async getPlayers() {
    try {
      const players = await SpotifyPlayer.find().sort({ date: -1 });
      return players;
    } catch (error) {
      logger.error('Error fetching Spotify players:', error);
      throw error;
    }
  }
}

module.exports = new MusicService();
