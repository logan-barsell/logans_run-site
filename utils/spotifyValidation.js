const { AppError } = require('../middleware/errorHandler');

// Spotify URL patterns for different content types
const SPOTIFY_PATTERNS = {
  track: /^https?:\/\/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})/,
  album: /^https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]{22})/,
  playlist: /^https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]{22})/,
  artist: /^https?:\/\/(?:open\.)?spotify\.com\/artist\/([a-zA-Z0-9]{22})/,
  episode: /^https?:\/\/(?:open\.)?spotify\.com\/episode\/([a-zA-Z0-9]{22})/,
  show: /^https?:\/\/(?:open\.)?spotify\.com\/show\/([a-zA-Z0-9]{22})/,
};

// Supported content types for embedding
const SUPPORTED_TYPES = ['track', 'album', 'playlist'];

/**
 * Validate Spotify URL for embedding (tracks, albums, playlists only)
 * @param {string} url - The Spotify URL to validate
 * @returns {Object} - Validation result with isValid, type, id
 * @throws {AppError} - If URL is invalid
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
 * Extract music type from Spotify URL for newsletter notifications
 * @param {string} url - The Spotify URL
 * @returns {string} - Music type (track, album, playlist, or 'music' as fallback)
 */
function extractMusicType(url) {
  if (!url) return 'music';

  for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
    if (pattern.test(url)) {
      return type;
    }
  }

  return 'music';
}

/**
 * Generate Spotify embed URL
 * @param {string} url - The Spotify URL
 * @param {string} theme - Theme parameter (auto, 0 for dark, 1 for light)
 * @returns {string|null} - Embed URL or null if invalid
 */
function generateSpotifyEmbedUrl(url, theme = 'auto') {
  try {
    const validation = validateSpotifyUrl(url);

    const baseEmbedUrl = `https://open.spotify.com/embed/${validation.type}/${validation.id}`;

    if (theme === 'auto' || !theme) {
      return `${baseEmbedUrl}?utm_source=generator`;
    } else {
      return `${baseEmbedUrl}?utm_source=generator&theme=${theme}`;
    }
  } catch (error) {
    return null;
  }
}

module.exports = {
  SPOTIFY_PATTERNS,
  SUPPORTED_TYPES,
  validateSpotifyUrl,
  extractMusicType,
  generateSpotifyEmbedUrl,
};
