const config = require('../config');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sets authentication cookies (access and refresh tokens) in the response.
 * @param {Object} res - Express response object
 * @param {string} accessToken - The access token to set as a cookie
 * @param {string} refreshToken - The refresh token to set as a cookie
 */
function setAuthCookies(res, accessToken, refreshToken) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000, // 1 hour
  };

  if (isProduction) {
    cookieOptions.domain = config.domain;
  }

  res.cookie('access_token', accessToken, cookieOptions);
  res.cookie('refresh_token', refreshToken, cookieOptions);
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
