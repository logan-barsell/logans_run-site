const { AppError } = require('../../middleware/errorHandler');

// Video category enum mapping
const VIDEO_CATEGORIES = {
  LIVE_PERFORMANCE: 'Live Performance',
  VLOG: 'Vlog',
  MUSIC_VIDEO: 'Music Video',
  LYRIC_VIDEO: 'Lyric Video',
};

// Category descriptions for newsletter notifications
const CATEGORY_DESCRIPTIONS = {
  LIVE_PERFORMANCE: 'New Live Performance Footage',
  VLOG: 'New Vlog Post',
  MUSIC_VIDEO: 'New Music Video Release',
  LYRIC_VIDEO: 'New Lyric Video Release',
};

/**
 * Validate video category
 * @param {string} category - The video category
 * @returns {string} - Validated category
 * @throws {AppError} - If category is invalid
 */
function validateVideoCategory(category) {
  if (!category) {
    throw new AppError('Video category is required', 400);
  }

  if (!Object.keys(VIDEO_CATEGORIES).includes(category)) {
    throw new AppError(
      `Invalid video category. Must be one of: ${Object.keys(
        VIDEO_CATEGORIES
      ).join(', ')}`,
      400
    );
  }

  return category;
}

/**
 * Get category description for newsletter notifications
 * @param {string} category - The video category
 * @returns {string} - Category description
 * @throws {AppError} - If category is invalid
 */
function getCategoryDescription(category) {
  const validatedCategory = validateVideoCategory(category);
  return CATEGORY_DESCRIPTIONS[validatedCategory];
}

/**
 * Get category display name
 * @param {string} category - The video category
 * @returns {string} - Category display name
 * @throws {AppError} - If category is invalid
 */
function getCategoryDisplayName(category) {
  const validatedCategory = validateVideoCategory(category);
  return VIDEO_CATEGORIES[validatedCategory];
}

module.exports = {
  VIDEO_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  validateVideoCategory,
  getCategoryDescription,
  getCategoryDisplayName,
};
