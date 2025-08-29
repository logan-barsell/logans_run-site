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
    if (theme.primaryFont) {
      let fontStack = '';
      switch (theme.primaryFont) {
        // ROCK/METAL FONTS
        case 'MetalMania':
          fontStack = "'MetalMania', cursive";
          break;
        case 'Butcherman':
          fontStack = "'Butcherman', cursive";
          break;
        case 'RoadRage':
          fontStack = "'RoadRage', cursive";
          break;
        case 'RubikBurned':
          fontStack = "'RubikBurned', cursive";
          break;
        case 'RubikGlitch':
          fontStack = "'RubikGlitch', cursive";
          break;
        case 'RubikWetPaint':
          fontStack = "'RubikWetPaint', cursive";
          break;
        case 'Bungee':
          fontStack = "'Bungee', cursive";
          break;
        case 'BungeeHairline':
          fontStack = "'BungeeHairline', cursive";
          break;
        case 'Bangers':
          fontStack = "'Bangers', cursive";
          break;
        case 'Barrio':
          fontStack = "'Barrio', cursive";
          break;
        case 'Frijole':
          fontStack = "'Frijole', cursive";
          break;
        case 'Griffy':
          fontStack = "'Griffy', cursive";
          break;
        case 'JollyLodger':
          fontStack = "'JollyLodger', cursive";
          break;
        case 'Lacquer':
          fontStack = "'Lacquer', cursive";
          break;
        case 'PirataOne':
          fontStack = "'PirataOne', cursive";
          break;
        // RETRO/VINTAGE FONTS
        case 'Asimovian':
          fontStack = "'Asimovian', monospace";
          break;
        case 'SixCaps':
          fontStack = "'SixCaps', sans-serif";
          break;
        case 'Smokum':
          fontStack = "'Smokum', cursive";
          break;
        case 'Rye':
          fontStack = "'Rye', cursive";
          break;
        case 'TradeWinds':
          fontStack = "'TradeWinds', cursive";
          break;
        case 'IMFellEnglishSC':
          fontStack = "'IMFellEnglishSC', serif";
          break;
        // DRAMATIC/ARTISTIC FONTS
        case 'Ewert':
          fontStack = "'Ewert', cursive";
          break;
        case 'FrederickatheGreat':
          fontStack = "'FrederickatheGreat', cursive";
          break;
        case 'GlassAntiqua':
          fontStack = "'GlassAntiqua', serif";
          break;
        case 'Lancelot':
          fontStack = "'Lancelot', cursive";
          break;
        case 'Macondo':
          fontStack = "'Macondo', cursive";
          break;
        // HAND-DRAWN/CASUAL FONTS
        case 'LondrinaSketch':
          fontStack = "'LondrinaSketch', cursive";
          break;
        case 'Caveat':
          fontStack = "'Caveat', cursive";
          break;
        case 'SmoochSans':
          fontStack = "'SmoochSans', cursive";
          break;
        case 'AmaticSC':
          fontStack = "'AmaticSC', cursive";
          break;
        case 'Chicle':
          fontStack = "'Chicle', cursive";
          break;
        // FUN/PLAYFUL FONTS
        case 'Aladin':
          fontStack = "'Aladin', cursive";
          break;
        case 'Bahiana':
          fontStack = "'Bahiana', cursive";
          break;
        case 'CaesarDressing':
          fontStack = "'CaesarDressing', cursive";
          break;
        case 'Danfo':
          fontStack = "'Danfo', cursive";
          break;
        case 'Fascinate':
          fontStack = "'Fascinate', cursive";
          break;
        case 'Iceland':
          fontStack = "'Iceland', cursive";
          break;
        // EXISTING FONTS
        case 'Anton':
          fontStack = "'Anton', sans-serif";
          break;
        case 'BebasNeue':
          fontStack = "'Bebas Neue', sans-serif";
          break;
        case 'Creepster':
          fontStack = "'Creepster', cursive";
          break;
        case 'IndieFlower':
          fontStack = "'Indie Flower', cursive";
          break;
        case 'Kalam':
          fontStack = "'Kalam', cursive";
          break;
        case 'Lobster':
          fontStack = "'Lobster', cursive";
          break;
        case 'Pacifico':
          fontStack = "'Pacifico', cursive";
          break;
        case 'Righteous':
          fontStack = "'Righteous', cursive";
          break;
        case 'Sancreek':
          fontStack = "'Sancreek', cursive";
          break;
        case 'sprayPaint':
          fontStack = "'sprayPaint', cursive";
          break;
        case 'VT323':
          fontStack = "'VT323', monospace";
          break;
        default:
          fontStack = "'Anton', sans-serif";
          break;
      }
      root.style.setProperty('--primary-font', fontStack);
    }

    if (theme.secondaryFont) {
      let fontStack = "'Oswald', sans-serif";
      switch (theme.secondaryFont) {
        // RETRO/VINTAGE FONTS
        case 'CourierPrime':
          fontStack = "'CourierPrime', monospace";
          break;
        case 'SpecialElite':
          fontStack = "'SpecialElite', monospace";
          break;
        case 'XanhMono':
          fontStack = "'XanhMono', monospace";
          break;
        case 'Oranienbaum':
          fontStack = "'Oranienbaum', serif";
          break;
        // DRAMATIC/ARTISTIC FONTS
        case 'CormorantUnicase':
          fontStack = "'CormorantUnicase', serif";
          break;
        case 'Bellefair':
          fontStack = "'Bellefair', serif";
          break;
        case 'Italiana':
          fontStack = "'Italiana', serif";
          break;
        // HAND-DRAWN/CASUAL FONTS
        case 'ArchitectsDaughter':
          fontStack = "'Architects Daughter', cursive";
          break;
        case 'Caveat':
          fontStack = "'Caveat', cursive";
          break;
        case 'SmoochSans':
          fontStack = "'SmoochSans', cursive";
          break;
        case 'AmaticSC':
          fontStack = "'AmaticSC', cursive";
          break;
        // READABLE/CLASSIC FONTS
        case 'Oswald':
          fontStack = "'Oswald', sans-serif";
          break;
        case 'EpundaSlab':
          fontStack = "'EpundaSlab', serif";
          break;
        case 'InstrumentSerif':
          fontStack = "'InstrumentSerif', serif";
          break;
        // EXISTING FONTS
        case 'Courier New':
          fontStack = "'Courier New', Courier, monospace";
          break;
        case 'VT323':
          fontStack = "'VT323', monospace";
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
