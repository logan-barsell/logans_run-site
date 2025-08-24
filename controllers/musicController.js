const musicService = require('../services/musicService');
const { AppError } = require('../middleware/errorHandler');

class MusicController {
  /**
   * Add a new Spotify player
   */
  async addPlayer(req, res, next) {
    try {
      const result = await musicService.addPlayer(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Player data is required') {
        return next(new AppError('Player data is required', 400));
      }
      if (
        error.message.includes('URL is required') ||
        error.message.includes('URL cannot be empty') ||
        error.message.includes('Invalid URL format') ||
        error.message.includes('Not a valid Spotify URL') ||
        error.message.includes('URLs are not supported')
      ) {
        return next(new AppError(error.message, 400));
      }
      next(new AppError('Failed to add Spotify player', 500));
    }
  }

  /**
   * Update a Spotify player
   */
  async updatePlayer(req, res, next) {
    try {
      const result = await musicService.updatePlayer(req.body);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Player data and ID are required') {
        return next(new AppError('Player data and ID are required', 400));
      }
      if (error.message === 'Player not found') {
        return next(new AppError('Player not found', 404));
      }
      if (
        error.message.includes('URL is required') ||
        error.message.includes('URL cannot be empty') ||
        error.message.includes('Invalid URL format') ||
        error.message.includes('Not a valid Spotify URL') ||
        error.message.includes('URLs are not supported')
      ) {
        return next(new AppError(error.message, 400));
      }
      next(new AppError('Failed to update Spotify player', 500));
    }
  }

  /**
   * Delete a Spotify player by ID
   */
  async deletePlayer(req, res, next) {
    try {
      const result = await musicService.deletePlayer(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Player deleted successfully',
      });
    } catch (error) {
      if (error.message === 'Player ID is required') {
        return next(new AppError('Player ID is required', 400));
      }
      if (error.message === 'Player not found') {
        return next(new AppError('Player not found', 404));
      }
      next(new AppError('Failed to delete Spotify player', 500));
    }
  }

  /**
   * Get a Spotify player by ID
   */
  async getPlayer(req, res, next) {
    try {
      const result = await musicService.getPlayer(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === 'Player ID is required') {
        return next(new AppError('Player ID is required', 400));
      }
      if (error.message === 'Player not found') {
        return next(new AppError('Player not found', 404));
      }
      next(new AppError('Failed to fetch Spotify player', 500));
    }
  }

  /**
   * Get all Spotify players
   */
  async getPlayers(req, res, next) {
    try {
      const players = await musicService.getPlayers();
      res.status(200).json({
        success: true,
        data: players,
      });
    } catch (error) {
      next(new AppError('Failed to fetch Spotify players', 500));
    }
  }
}

module.exports = new MusicController();
