/**
 * Centralized Color Utilities Exports
 * All color-related functions are exported from this single location
 */

// Color palettes
export {
  getColorPalette,
  getColor,
  getPreselectedColors,
  getColorName,
  default as colorPalettes,
} from './colorPalettes';

// CSS color utilities
export { toRgbString } from './cssColors';
