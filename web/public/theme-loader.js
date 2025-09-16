// Theme loader for Next.js app
// Handles theme data reading and pace configuration
(function () {
  'use strict';

  // Color validation function (matches server-side validation)
  function validateColor(color) {
    if (typeof color !== 'string') return false;
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // Fetch theme data from data attribute (secure approach)
  function fetchTheme() {
    let theme = null;

    try {
      const themeElement = document.getElementById('theme-data');
      if (themeElement && themeElement.dataset.theme) {
        theme = JSON.parse(themeElement.dataset.theme);
      }
    } catch (error) {
      console.warn('Theme data parse failed:', error);
    }

    return theme;
  }

  // Set CSS variables on :root (backup/redundancy) with validation
  function setCSSVariables(theme) {
    const root = document.documentElement;

    // Validate and set primary color
    if (theme?.primaryColor && validateColor(theme.primaryColor)) {
      root.style.setProperty('--main', theme.primaryColor);
    } else if (theme?.primaryColor) {
      console.warn(
        'Invalid primary color, using fallback:',
        theme.primaryColor
      );
      root.style.setProperty('--main', '#e3ff05'); // Safe fallback
    }

    // Validate and set secondary color
    if (theme?.secondaryColor && validateColor(theme.secondaryColor)) {
      root.style.setProperty('--secondary', theme.secondaryColor);
    } else if (theme?.secondaryColor) {
      console.warn(
        'Invalid secondary color, using fallback:',
        theme.secondaryColor
      );
      root.style.setProperty('--secondary', '#f08080'); // Safe fallback
    }

    // Set fonts (already validated by server-side font map)
    if (theme?.primaryFont) {
      const fontStack = `'${theme.primaryFont}', Arial, sans-serif`;
      root.style.setProperty('--primary-font', fontStack);
    }
    if (theme?.secondaryFont) {
      const fontStack = `'${theme.secondaryFont}', 'Courier New', monospace`;
      root.style.setProperty('--secondary-font', fontStack);
    }
  }

  // Configure pace loader with validation
  function configurePace(theme) {
    if (!theme) {
      console.warn('No theme data available, using defaults');
      theme = { paceTheme: 'minimal', primaryColor: '#e3ff05' };
    }

    // Validate and sanitize pace theme name (prevent path traversal)
    let paceTheme = theme.paceTheme || 'minimal';
    if (!/^[a-zA-Z0-9-_]+$/.test(paceTheme)) {
      console.warn('Invalid pace theme name, using default');
      paceTheme = 'minimal';
    }

    // Set pace options matching old implementation
    window.paceOptions = {
      eventLag: false,
      ajax: false,
      elements: { selectors: ['body'] },
      restartOnRequestAfter: false,
      target: 'body',
      className: `pace-theme-${paceTheme}`,
    };

    // Load the pace theme CSS from local files
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/pace/${paceTheme}.css`;
    link.id = 'pace-theme-css';

    // Remove any existing pace theme CSS
    const existingLink = document.getElementById('pace-theme-css');
    if (existingLink) {
      existingLink.remove();
    }

    document.head.appendChild(link);

    console.log('Pace configured with theme:', paceTheme);
  }

  // Main initialization function
  function initializeTheme() {
    const theme = fetchTheme();

    // Configure pace with theme data (CSS variables already set by server)
    configurePace(theme);

    console.log('Theme initialization complete');
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
})();
