/**
 * Theme caching utilities for localStorage
 * Provides offline fallback and performance optimization
 */

const THEME_CACHE_KEY = 'bandsyte_theme_cache';
const THEME_CACHE_VERSION = '1.0';
const CACHE_EXPIRY_HOURS = 24; // Cache themes for 24 hours

/**
 * Get cached theme for a tenant
 * @param {string} tenantId - The tenant ID
 * @returns {Object|null} Cached theme or null if not found/expired
 */
export function getCachedTheme(tenantId) {
  if (typeof window === 'undefined') return null; // SSR safety

  try {
    const cacheData = localStorage.getItem(THEME_CACHE_KEY);
    if (!cacheData) return null;

    const cache = JSON.parse(cacheData);

    // Check cache version
    if (cache.version !== THEME_CACHE_VERSION) {
      clearThemeCache();
      return null;
    }

    // Check if tenant theme exists and is not expired
    const tenantCache = cache.themes[tenantId];
    if (!tenantCache) return null;

    const now = Date.now();
    const cacheAge = now - tenantCache.timestamp;
    const maxAge = CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Convert to milliseconds

    if (cacheAge > maxAge) {
      // Cache expired, remove this tenant's cache
      delete cache.themes[tenantId];
      localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    return tenantCache.theme;
  } catch (error) {
    console.warn('Error reading theme cache:', error);
    return null;
  }
}

/**
 * Cache a theme for a tenant
 * @param {string} tenantId - The tenant ID
 * @param {Object} theme - The theme object to cache
 */
export function setCachedTheme(tenantId, theme) {
  if (typeof window === 'undefined') return; // SSR safety

  try {
    const cacheData = localStorage.getItem(THEME_CACHE_KEY);
    let cache = cacheData
      ? JSON.parse(cacheData)
      : { version: THEME_CACHE_VERSION, themes: {} };

    // Update cache version if needed
    if (cache.version !== THEME_CACHE_VERSION) {
      cache = { version: THEME_CACHE_VERSION, themes: {} };
    }

    // Store theme with timestamp
    cache.themes[tenantId] = {
      theme,
      timestamp: Date.now(),
    };

    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Error caching theme:', error);
  }
}

/**
 * Get cached default theme (for offline fallback)
 * @returns {Object|null} Cached default theme or null
 */
export function getCachedDefaultTheme() {
  return getCachedTheme('default');
}

/**
 * Cache the default theme
 * @param {Object} theme - The default theme object
 */
export function setCachedDefaultTheme(theme) {
  setCachedTheme('default', theme);
}

/**
 * Clear all theme cache
 */
export function clearThemeCache() {
  if (typeof window === 'undefined') return; // SSR safety

  try {
    localStorage.removeItem(THEME_CACHE_KEY);
  } catch (error) {
    console.warn('Error clearing theme cache:', error);
  }
}

/**
 * Get cache statistics for debugging
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  if (typeof window === 'undefined') return null; // SSR safety

  try {
    const cacheData = localStorage.getItem(THEME_CACHE_KEY);
    if (!cacheData) return { totalThemes: 0, tenants: [] };

    const cache = JSON.parse(cacheData);
    const tenants = Object.keys(cache.themes || {});

    return {
      totalThemes: tenants.length,
      tenants,
      version: cache.version,
    };
  } catch (error) {
    console.warn('Error getting cache stats:', error);
    return null;
  }
}
