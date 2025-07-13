// Theme loader utility functions
(function () {
  'use strict';

  // Fetch theme data from the API
  function fetchTheme() {
    let theme = null;

    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/theme', false);
      xhr.onerror = function () {
        console.warn('Theme fetch failed (network error)');
      };
      xhr.ontimeout = function () {
        console.warn('Theme fetch timed out');
      };
      xhr.send();

      if (xhr.status === 200 && xhr.responseText) {
        try {
          theme = JSON.parse(xhr.responseText);
        } catch (error) {
          console.warn('Theme parse failed:', error);
        }
      } else {
        console.warn('Theme fetch returned status:', xhr.status);
      }
    } catch (error) {
      console.warn('Theme fetch failed:', error);
    }

    return theme;
  }

  // Update page title
  function updatePageTitle(theme) {
    if (theme.siteTitle) {
      document.title = theme.siteTitle;
    }
  }

  // Update favicon
  function updateFavicon(theme) {
    if (theme.bandLogoUrl) {
      console.log('🎯 Setting favicon:', theme.bandLogoUrl);

      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll(
        'link[rel*="icon"], link[rel="apple-touch-icon"]'
      );
      existingFavicons.forEach(link => link.remove());

      // Add new favicon link
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';

      // Detect image type from URL or default to png
      const imageType = theme.bandLogoUrl.match(
        /\.(jpg|jpeg|png|gif|svg|ico)$/i
      );
      faviconLink.type = imageType ? `image/${imageType[1]}` : 'image/png';
      faviconLink.href = theme.bandLogoUrl;
      document.head.appendChild(faviconLink);

      // Add apple touch icon
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.href = theme.bandLogoUrl;
      document.head.appendChild(appleTouchIcon);
    }
  }

  // Set CSS variables
  function setCSSVariables(theme) {
    const root = document.documentElement;
    if (theme.primaryColor)
      root.style.setProperty('--main', theme.primaryColor);
    if (theme.secondaryColor)
      root.style.setProperty('--secondary', theme.secondaryColor);
    if (theme.primaryFont)
      root.style.setProperty('--primary-font', theme.primaryFont);

    if (theme.secondaryFont) {
      let fontStack = "'Courier New', Courier, monospace";
      switch (theme.secondaryFont) {
        case 'Fira Mono':
          fontStack = "'Fira Mono', 'Courier New', Courier, monospace";
          break;
        case 'JetBrains Mono':
          fontStack = "'JetBrains Mono', 'Courier New', Courier, monospace";
          break;
        case 'Roboto Mono':
          fontStack = "'Roboto Mono', 'Courier New', Courier, monospace";
          break;
      }
      root.style.setProperty('--secondary-font', fontStack);
    }
  }

  // Configure pace loader
  function configurePace(theme) {
    window.paceOptions = {
      eventLag: false,
      ajax: false,
      elements: { selectors: ['#root'] },
      restartOnRequestAfter: false,
      target: '#root',
      className: `pace-theme-${theme.paceTheme}`,
    };

    // Load the pace theme CSS from local files
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/pace/${theme.paceTheme}.css`;
    document.head.appendChild(link);
  }

  // Main initialization function
  function initializeTheme() {
    const theme = fetchTheme();

    // Only proceed if we have valid theme data
    if (theme && Object.keys(theme).length > 0) {
      updatePageTitle(theme);
      updateFavicon(theme);
      setCSSVariables(theme);
      configurePace(theme);
    }
  }

  // Expose the main function globally
  window.initializeTheme = initializeTheme;

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }
})();
