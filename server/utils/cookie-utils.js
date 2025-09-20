const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sets authentication cookies (access and refresh tokens) in the response.
 * @param {Object} res - Express response object
 * @param {string} accessToken - The access token to set as a cookie
 * @param {string} refreshToken - The refresh token to set as a cookie
 * @param {string} requestDomain - The domain from the request (optional)
 */
function setAuthCookies(res, accessToken, refreshToken, requestDomain = null) {
  const baseCookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  // Smart cookie domain strategy for multi-tenant setup
  if (isProduction && requestDomain) {
    // For subdomains like band1.bandsyte.com, set domain to .bandsyte.com for sharing
    if (requestDomain.endsWith('.bandsyte.com')) {
      baseCookieOptions.domain = '.bandsyte.com';
    }
    // For custom domains like yesdevil.com, don't set domain attribute
    // This makes cookies domain-specific and secure
    // else: no domain attribute set = cookies only work on exact domain
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
 * @param {string} requestDomain - The domain from the request (optional)
 */
function clearAuthCookies(res, requestDomain = null) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  // Apply the same smart domain strategy for clearing cookies
  if (isProduction && requestDomain) {
    // For subdomains like band1.bandsyte.com, clear from .bandsyte.com
    if (requestDomain.endsWith('.bandsyte.com')) {
      cookieOptions.domain = '.bandsyte.com';
    }
    // For custom domains, don't set domain attribute (clears from exact domain)
  }

  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
}

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
