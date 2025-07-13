/**
 * Spotify URL Validation Utility
 * Validates and normalizes Spotify URLs for different content types
 */

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
 * Validates a Spotify URL
 * @param {string} url - The Spotify URL to validate
 * @returns {object} - Validation result with isValid, type, id, and error message
 */
export const validateSpotifyUrl = url => {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      type: null,
      id: null,
      error: 'URL is required and must be a string',
    };
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return {
      isValid: false,
      type: null,
      id: null,
      error: 'URL cannot be empty',
    };
  }

  // Check if it's a valid URL format
  try {
    new URL(trimmedUrl);
  } catch (error) {
    return {
      isValid: false,
      type: null,
      id: null,
      error: 'Invalid URL format',
    };
  }

  // Check against Spotify patterns
  for (const [type, pattern] of Object.entries(SPOTIFY_PATTERNS)) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      const id = match[1];

      // Check if content type is supported for embedding
      if (!SUPPORTED_TYPES.includes(type)) {
        return {
          isValid: false,
          type,
          id,
          error: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } URLs are not supported for embedding`,
        };
      }

      return {
        isValid: true,
        type,
        id,
        error: null,
      };
    }
  }

  return {
    isValid: false,
    type: null,
    id: null,
    error: 'Not a valid Spotify URL. Must be a track, album, or playlist URL',
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
 * @param {string} theme - Theme parameter (optional)
 * @returns {string|null} - Embed URL or null if invalid
 */
export const generateSpotifyEmbedUrl = (url, theme = '') => {
  const validation = validateSpotifyUrl(url);

  if (!validation.isValid) {
    return null;
  }

  const baseEmbedUrl = `https://open.spotify.com/embed/${validation.type}/${validation.id}`;
  const themeParam = theme ? `&theme=${theme}` : '';

  return `${baseEmbedUrl}?utm_source=generator${themeParam}`;
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
