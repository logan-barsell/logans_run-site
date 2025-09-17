import { getColorPalette } from '../colors/colorPalettes';
import { hexToRgb } from '../colors/hexToRgb';
import { getFontStack } from '../fonts/getFontStack';

/**
 * Generate CSS variables as CSS string for :root
 * @param {Object} theme - Theme object from database
 * @returns {string} CSS string with CSS custom properties for :root
 */
export function generateStyleString(theme) {
  // Generate CSS variables for SSR - using color palette system like old implementation
  const palette = theme?.backgroundColor
    ? getColorPalette(theme.backgroundColor)
    : getColorPalette('black');

  const primaryFontStack = getFontStack(
    theme?.primaryFont,
    "'Anton', sans-serif"
  );
  const secondaryFontStack = getFontStack(
    theme?.secondaryFont,
    "'Oswald', sans-serif"
  );

  return `:root {
  --main: ${theme?.primaryColor};
  --main-rgb: ${hexToRgb(theme.primaryColor)};
  --secondary: ${theme?.secondaryColor};
  --secondary-rgb: ${hexToRgb(theme.secondaryColor)};
  --background: ${palette.background};
  --navbar-bg: ${palette.navbar};
  --secondary-nav-bg: ${palette.secondaryNav};
  --accordion-bg: ${palette.accordion};
  --accordion-content-bg: ${palette.accordionContent};
  --accordion-content-light: ${palette.accordionContentLight};
  --modal-bg: ${palette.modalBackground};
  --form-bg: ${palette.formBackground};
  --form-focus-bg: ${palette.formFocusBackground};
  --table-bg: ${palette.tableBackground};
  --dropdown-bg: ${palette.dropdownBackground};
  --primary-font: ${primaryFontStack};
  --secondary-font: ${secondaryFontStack};
}`;
}

/**
 * Generate CSS variables as React style object for inline styles (legacy support)
 * @param {Object} theme - Theme object from database
 * @returns {Object} React style object with CSS custom properties
 */
export function generateStyleObject(theme) {
  // Generate CSS variables for SSR - using color palette system like old implementation
  const palette = theme?.backgroundColor
    ? getColorPalette(theme.backgroundColor)
    : getColorPalette('black');

  const primaryFontStack = getFontStack(
    theme?.primaryFont,
    "'Anton', sans-serif"
  );
  const secondaryFontStack = getFontStack(
    theme?.secondaryFont,
    "'Oswald', sans-serif"
  );

  return {
    // THEME-SPECIFIC VARIABLES ONLY
    '--main': theme?.primaryColor || '#e3ff05',
    '--main-rgb': theme?.primaryColor
      ? hexToRgb(theme.primaryColor)
      : '227, 255, 5',
    '--secondary': theme?.secondaryColor || '#f08080',
    '--secondary-rgb': theme?.secondaryColor
      ? hexToRgb(theme.secondaryColor)
      : '240, 128, 128',
    '--background': palette.background,
    '--navbar-bg': palette.navbar,
    '--secondary-nav-bg': palette.secondaryNav,
    '--accordion-bg': palette.accordion,
    '--accordion-content-bg': palette.accordionContent,
    '--accordion-content-light': palette.accordionContentLight,
    '--modal-bg': palette.modalBackground,
    '--form-bg': palette.formBackground,
    '--form-focus-bg': palette.formFocusBackground,
    '--table-bg': palette.tableBackground,
    '--dropdown-bg': palette.dropdownBackground,
    '--primary-font': primaryFontStack,
    '--secondary-font': secondaryFontStack,
  };
}
