/**
 * Request utility functions
 */

/**
 * Extracts the client's real IP address from the request.
 * It prioritizes `x-forwarded-for` (for proxies) and falls back to `req.ip`.
 * @param {Object} req - Express request object
 * @returns {string} Client IP address
 */
function getClientIp(req) {
  let ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.ip || 'unknown';

  if (Array.isArray(ip)) ip = ip[0]; // Ensure we return a single IP if it's an array
  return ip;
}

/**
 * Helper to parse a number parameter or return a default.
 * @param {*} param - Parameter to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number or default value
 */
function parseNumber(param, defaultValue) {
  const parsed = parseInt(param, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Helper to convert a string parameter to boolean.
 * @param {*} param - Parameter to parse
 * @returns {boolean|undefined} Boolean value or undefined if invalid
 */
function parseBooleanParam(param) {
  if (typeof param === 'string') {
    const lower = param.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  return undefined;
}

module.exports = {
  getClientIp,
  parseNumber,
  parseBooleanParam,
};
