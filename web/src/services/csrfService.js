import { handleServiceError } from '../lib/errorHandler';

// Module-level state for token caching
let token = null;
let tokenPromise = null;

/**
 * Get CSRF token from server
 * Caches the token to avoid multiple requests
 */
async function getToken() {
  // If we already have a token, return it
  if (token) {
    return token;
  }

  // If we're already fetching a token, wait for that request
  if (tokenPromise) {
    return tokenPromise;
  }

  // Fetch new token
  tokenPromise = fetchToken();
  token = await tokenPromise;
  tokenPromise = null;

  return token;
}

/**
 * Fetch CSRF token from server
 */
async function fetchToken() {
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.csrfToken;
  } catch (error) {
    const errorData = handleServiceError(error, {
      operation: 'fetchToken',
      customMessage: 'Unable to load security token. Please try again later.',
    });
    throw errorData;
  }
}

/**
 * Clear cached token (call when token becomes invalid)
 */
function clearToken() {
  token = null;
  tokenPromise = null;
}

/**
 * Add CSRF token to request headers
 */
async function addTokenToHeaders(headers = {}) {
  const csrfToken = await getToken();
  return {
    ...headers,
    'X-CSRF-Token': csrfToken,
  };
}

/**
 * Add CSRF token to form data
 */
async function addTokenToFormData(formData) {
  const csrfToken = await getToken();
  const newFormData = new FormData();

  // Copy existing form data
  for (const [key, value] of formData.entries()) {
    newFormData.append(key, value);
  }

  // Add CSRF token
  newFormData.append('_csrf', csrfToken);

  return newFormData;
}

/**
 * Add CSRF token to JSON body
 */
async function addTokenToBody(body = {}) {
  const csrfToken = await getToken();
  return {
    ...body,
    _csrf: csrfToken,
  };
}

// Export functions
export {
  getToken,
  fetchToken,
  clearToken,
  addTokenToHeaders,
  addTokenToFormData,
  addTokenToBody,
};
