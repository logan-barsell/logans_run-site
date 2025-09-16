/**
 * Convert hex color to RGB format with validation
 * @param {string} hex - Hex color code (with or without #)
 * @returns {string} RGB color string in format "r, g, b"
 */

/**
 * Validate hex color format
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export function validateColor(color) {
  if (typeof color !== 'string') return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert hex color to RGB format
 * @param {string} hex - Hex color code (with or without #)
 * @returns {string} RGB color string in format "r, g, b"
 */
export function hexToRgb(hex) {
  // Validate color first for security
  if (!validateColor(hex)) {
    console.warn('Invalid hex color provided:', hex);
    return '0, 0, 0'; // Safe fallback
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : '0, 0, 0';
}
