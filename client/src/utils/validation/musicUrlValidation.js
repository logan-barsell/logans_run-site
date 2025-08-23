/**
 * Music Platform URL Validation Utility
 * Validates URLs for Apple Music, YouTube, and SoundCloud
 */

import { validateUrlWithPatterns } from './formValidation';

// Apple Music URL patterns
const APPLE_MUSIC_PATTERNS = {
  album:
    /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/(?:album|playlist)\/[^\/]+\/(\d+)/,
  song: /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/album\/[^\/]+\/(\d+)\?i=\d+/,
  artist: /^https?:\/\/(?:music\.)?apple\.com\/[a-z]{2}\/artist\/[^\/]+\/(\d+)/,
};

// YouTube URL patterns
const YOUTUBE_PATTERNS = {
  video:
    /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  playlist:
    /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/,
  channel: /^https?:\/\/(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
  user: /^https?:\/\/(?:www\.)?youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
};

// SoundCloud URL patterns
const SOUNDCLOUD_PATTERNS = {
  track: /^https?:\/\/(?:www\.)?soundcloud\.com\/[^\/]+\/[^\/]+/,
  playlist: /^https?:\/\/(?:www\.)?soundcloud\.com\/[^\/]+\/sets\/[^\/]+/,
  artist: /^https?:\/\/(?:www\.)?soundcloud\.com\/[^\/]+/,
};

/**
 * Validates an Apple Music URL
 * @param {string} url - The Apple Music URL to validate
 * @returns {object} - Validation result with isValid, type, and error message
 */
export const validateAppleMusicUrl = url => {
  const result = validateUrlWithPatterns(
    url,
    'Apple Music',
    APPLE_MUSIC_PATTERNS
  );
  return {
    isValid: result.isValid,
    type: result.type,
    error: result.error,
  };
};

/**
 * Validates a YouTube URL
 * @param {string} url - The YouTube URL to validate
 * @returns {object} - Validation result with isValid, type, and error message
 */
export const validateYouTubeUrl = url => {
  const result = validateUrlWithPatterns(url, 'YouTube', YOUTUBE_PATTERNS);
  return {
    isValid: result.isValid,
    type: result.type,
    error: result.error,
  };
};

/**
 * Validates a SoundCloud URL
 * @param {string} url - The SoundCloud URL to validate
 * @returns {object} - Validation result with isValid, type, and error message
 */
export const validateSoundCloudUrl = url => {
  const result = validateUrlWithPatterns(
    url,
    'SoundCloud',
    SOUNDCLOUD_PATTERNS
  );
  return {
    isValid: result.isValid,
    type: result.type,
    error: result.error,
  };
};
