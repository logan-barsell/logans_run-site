/**
 * Social Media URL Validation Utility
 * Validates URLs for Facebook, Instagram, TikTok, YouTube, and X (Twitter)
 */

import { validateUrlWithPatterns } from './formValidation';

// Facebook URL patterns
const FACEBOOK_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/[^\/]+/,
  /^(?:https?:\/\/)?(?:www\.)?fb\.com\/[^\/]+/,
];

// Instagram URL patterns
const INSTAGRAM_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/[^\/]+/,
  /^(?:https?:\/\/)?(?:www\.)?ig\.com\/[^\/]+/,
];

// TikTok URL patterns
const TIKTOK_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[^\/]+/,
  /^(?:https?:\/\/)?(?:www\.)?vm\.tiktok\.com\/[^\/]+/,
];

// YouTube social URL patterns (channels/users)
const YOUTUBE_SOCIAL_PATTERNS = {
  channel: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
  user: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
  custom: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
};

// X (Twitter) URL patterns
const X_PATTERNS = [
  /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/[^\/]+/,
  /^(?:https?:\/\/)?(?:www\.)?x\.com\/[^\/]+/,
];

/**
 * Validates a Facebook URL
 * @param {string} url - The Facebook URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateFacebookUrl = url => {
  const result = validateUrlWithPatterns(url, 'Facebook', FACEBOOK_PATTERNS);
  return {
    isValid: result.isValid,
    error: result.error,
  };
};

/**
 * Validates an Instagram URL
 * @param {string} url - The Instagram URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateInstagramUrl = url => {
  const result = validateUrlWithPatterns(url, 'Instagram', INSTAGRAM_PATTERNS);
  return {
    isValid: result.isValid,
    error: result.error,
  };
};

/**
 * Validates a TikTok URL
 * @param {string} url - The TikTok URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateTikTokUrl = url => {
  const result = validateUrlWithPatterns(url, 'TikTok', TIKTOK_PATTERNS);
  return {
    isValid: result.isValid,
    error: result.error,
  };
};

/**
 * Validates a YouTube social URL (channel/user)
 * @param {string} url - The YouTube URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateYouTubeSocialUrl = url => {
  const result = validateUrlWithPatterns(
    url,
    'YouTube',
    YOUTUBE_SOCIAL_PATTERNS
  );
  return {
    isValid: result.isValid,
    error: result.error,
  };
};

/**
 * Validates an X (Twitter) URL
 * @param {string} url - The X URL to validate
 * @returns {object} - Validation result with isValid and error message
 */
export const validateXUrl = url => {
  const result = validateUrlWithPatterns(url, 'X (Twitter)', X_PATTERNS);
  return {
    isValid: result.isValid,
    error: result.error,
  };
};
