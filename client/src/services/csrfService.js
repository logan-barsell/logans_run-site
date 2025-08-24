import { handleServiceError } from '../utils/errorHandler';

class CSRFService {
  constructor() {
    this.token = null;
    this.tokenPromise = null;
  }

  /**
   * Get CSRF token from server
   * Caches the token to avoid multiple requests
   */
  async getToken() {
    // If we already have a token, return it
    if (this.token) {
      return this.token;
    }

    // If we're already fetching a token, wait for that request
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Fetch new token
    this.tokenPromise = this.fetchToken();
    this.token = await this.tokenPromise;
    this.tokenPromise = null;

    return this.token;
  }

  /**
   * Fetch CSRF token from server
   */
  async fetchToken() {
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
      const { message } = handleServiceError(error, 'Failed to get CSRF token');
      throw new Error(message);
    }
  }

  /**
   * Clear cached token (call when token becomes invalid)
   */
  clearToken() {
    this.token = null;
    this.tokenPromise = null;
  }

  /**
   * Add CSRF token to request headers
   */
  async addTokenToHeaders(headers = {}) {
    const token = await this.getToken();
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  }

  /**
   * Add CSRF token to form data
   */
  async addTokenToFormData(formData) {
    const token = await this.getToken();
    const newFormData = new FormData();

    // Copy existing form data
    for (const [key, value] of formData.entries()) {
      newFormData.append(key, value);
    }

    // Add CSRF token
    newFormData.append('_csrf', token);

    return newFormData;
  }

  /**
   * Add CSRF token to JSON body
   */
  async addTokenToBody(body = {}) {
    const token = await this.getToken();
    return {
      ...body,
      _csrf: token,
    };
  }
}

// Export singleton instance
export default new CSRFService();
