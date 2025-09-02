const config = require('../config');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sets authentication cookies (access and refresh tokens) in the response.
 * @param {Object} res - Express response object
 * @param {string} accessToken - The access token to set as a cookie
 * @param {string} refreshToken - The refresh token to set as a cookie
 */
function setAuthCookies(res, accessToken, refreshToken) {
  const baseCookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  };

  if (isProduction) {
    baseCookieOptions.domain = config.domain;
  }

  // Access token: 1 hour expiry
  const accessTokenOptions = {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  };

  // Refresh token: 7 days expiry (matches JWT expiry)
  const refreshTokenOptions = {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);
}

/**
 * Clears authentication cookies from the response.
 * @param {Object} res - Express response object
 */
function clearAuthCookies(res) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  if (isProduction) {
    cookieOptions.domain = config.domain;
  }

  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
}

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
