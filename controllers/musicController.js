const MusicService = require('../services/musicService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Add a new Spotify player
 */
async function addPlayer(req, res, next) {
  try {
    const result = await MusicService.addPlayer(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to add Spotify player:', error);
    next(error);
  }
}

/**
 * Update a Spotify player
 */
async function updatePlayer(req, res, next) {
  try {
    const result = await MusicService.updatePlayer(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to update Spotify player:', error);
    next(error);
  }
}

/**
 * Delete a Spotify player by ID
 */
async function deletePlayer(req, res, next) {
  try {
    const result = await MusicService.deletePlayer(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error) {
    logger.error('❌ Failed to delete Spotify player:', error);
    next(error);
  }
}

/**
 * Get a Spotify player by ID
 */
async function getPlayer(req, res, next) {
  try {
    const result = await MusicService.getPlayer(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch Spotify player:', error);
    next(error);
  }
}

/**
 * Get all Spotify players
 */
async function getPlayers(req, res, next) {
  try {
    const players = await MusicService.getPlayers();
    res.status(200).json({
      success: true,
      data: players,
    });
  } catch (error) {
    logger.error('❌ Failed to fetch Spotify players:', error);
    next(error);
  }
}

module.exports = {
  addPlayer,
  updatePlayer,
  deletePlayer,
  getPlayer,
  getPlayers,
};
