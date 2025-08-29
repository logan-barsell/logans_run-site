/**
 * Spotify URL Validation Utility
 * Validates and normalizes Spotify URLs for different content types
 */

import { validateUrlWithPatterns } from './formValidation';

// Spotify URL patterns for different content types
const SPOTIFY_PATTERNS = {
  track:
    /^https?:\/\/(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
  album:
    /^https?:\/\/(?:open\.)?spotify\.com\/album\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
  playlist:
    /^https?:\/\/(?:open\.)?spotify\.com\/playlist\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
  artist:
    /^https?:\/\/(?:open\.)?spotify\.com\/artist\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
  episode:
    /^https?:\/\/(?:open\.)?spotify\.com\/episode\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
  show: /^https?:\/\/(?:open\.)?spotify\.com\/show\/([a-zA-Z0-9]{22})(?:\?.*)?$/,
};

// Supported content types for embedding
const SUPPORTED_TYPES = ['track', 'album', 'playlist'];

/**
 * Validates any Spotify URL (for social media links)
 * @param {string} url - The Spotify URL to validate
 * @returns {object} - Validation result with isValid, type, id, and error message
 */
export const validateSpotifySocialUrl = url => {
  const result = validateUrlWithPatterns(url, 'Spotify', SPOTIFY_PATTERNS);
  return {
    isValid: result.isValid,
    type: result.type,
    id: result.id,
    error: result.error,
  };
};

/**
 * Validates a Spotify URL for embedding (tracks, albums, playlists only)
 * @param {string} url - The Spotify URL to validate
 * @returns {object} - Validation result with isValid, type, id, and error message
 */
export const validateSpotifyUrl = url => {
  // Try direct validation first
  for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
    const match = url.match(pattern);
    if (match && SUPPORTED_TYPES.includes(type)) {
      return {
        isValid: true,
        type: type,
        id: match[1],
        error: null,
      };
    }
  }

  // Fallback to the original validation
  const result = validateUrlWithPatterns(
    url,
    'Spotify',
    SPOTIFY_PATTERNS,
    SUPPORTED_TYPES
  );

  return {
    isValid: result.isValid,
    type: result.type,
    id: result.id,
    error: result.error,
  };
};

/**
 * Normalizes a Spotify URL to the standard format
 * @param {string} url - The Spotify URL to normalize
 * @returns {string|null} - Normalized URL or null if invalid
 */
export const normalizeSpotifyUrl = url => {
  const validation = validateSpotifyUrl(url);

  if (!validation.isValid) {
    return null;
  }

  return `https://open.spotify.com/${validation.type}/${validation.id}`;
};

/**
 * Generates an embed URL from a Spotify URL
 * @param {string} url - The Spotify URL
 * @param {string} theme - Theme parameter (auto, 0 for dark, 1 for light)
 * @returns {string|null} - Embed URL or null if invalid
 */
export const generateSpotifyEmbedUrl = (url, theme = 'auto') => {
  const validation = validateSpotifyUrl(url);

  if (!validation.isValid) {
    return null;
  }

  // Try a simpler approach first - just use the basic embed URL
  const baseEmbedUrl = `https://open.spotify.com/embed/${validation.type}/${validation.id}`;

  // For 'auto' theme, don't add any theme parameter (like the working artist embed)
  let finalUrl;
  if (theme === 'auto' || !theme) {
    finalUrl = `${baseEmbedUrl}?utm_source=generator`;
  } else {
    finalUrl = `${baseEmbedUrl}?utm_source=generator&theme=${theme}`;
  }

  return finalUrl;
};

/**
 * Extracts the Spotify ID from a URL
 * @param {string} url - The Spotify URL
 * @returns {string|null} - Spotify ID or null if invalid
 */
export const extractSpotifyId = url => {
  const validation = validateSpotifyUrl(url);
  return validation.isValid ? validation.id : null;
};

/**
 * Gets the content type from a Spotify URL
 * @param {string} url - The Spotify URL
 * @returns {string|null} - Content type or null if invalid
 */
export const getSpotifyContentType = url => {
  const validation = validateSpotifyUrl(url);
  return validation.isValid ? validation.type : null;
};

/**
 * Validates multiple Spotify URLs
 * @param {Array} urls - Array of Spotify URLs
 * @returns {Array} - Array of validation results
 */
export const validateSpotifyUrls = urls => {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.map(url => validateSpotifyUrl(url));
};

/**
 * Checks if a URL is a valid Spotify URL for embedding
 * @param {string} url - The Spotify URL
 * @returns {boolean} - True if valid and embeddable
 */
export const isEmbeddableSpotifyUrl = url => {
  const validation = validateSpotifyUrl(url);
  return validation.isValid && SUPPORTED_TYPES.includes(validation.type);
};
