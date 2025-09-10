import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme, updateTheme } from '../redux/actions';
import { getColorPalette } from '../utils/colorPalettes';
import { toRgbString } from '../utils/cssColors';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Function to update CSS custom properties
const updateCSSVariables = theme => {
  const root = document.documentElement;
  if (theme.primaryColor) {
    root.style.setProperty('--main', theme.primaryColor);
  }
  if (theme.secondaryColor) {
    root.style.setProperty('--secondary', theme.secondaryColor);
    const rgb = toRgbString(theme.secondaryColor);
    if (rgb) root.style.setProperty('--secondary-rgb', rgb);
  }

  // Use color palette for background colors
  if (theme.backgroundColor) {
    const palette = getColorPalette(theme.backgroundColor);
    root.style.setProperty('--background', palette.background);
    root.style.setProperty('--navbar-bg', palette.navbar);
    root.style.setProperty('--secondary-nav-bg', palette.secondaryNav);
    root.style.setProperty('--accordion-bg', palette.accordion);
    root.style.setProperty('--accordion-content-bg', palette.accordionContent);
    root.style.setProperty(
      '--accordion-content-light',
      palette.accordionContentLight
    );
    root.style.setProperty('--modal-bg', palette.modalBackground);
    root.style.setProperty('--form-bg', palette.formBackground);
    root.style.setProperty('--form-focus-bg', palette.formFocusBackground);
    root.style.setProperty('--table-bg', palette.tableBackground);
    root.style.setProperty('--dropdown-bg', palette.dropdownBackground);
  }

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
    let fontStack = '';
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
      default:
        fontStack = "'Oswald', sans-serif";
        break;
    }
    root.style.setProperty('--secondary-font', fontStack);
  }
};

// Function to update pace theme and restart Pace
const updatePaceTheme = paceTheme => {
  // Remove any existing pace theme CSS
  const existingLinks = document.querySelectorAll(
    'link[href*="/themes/pace/"]'
  );
  existingLinks.forEach(link => link.remove());

  // Load new pace theme CSS
  const themeName = paceTheme || 'minimal';
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `/themes/pace/${themeName}.css`;

  // When CSS loads, restart Pace
  link.onload = () => {
    if (window.Pace) {
      // Update pace options with new theme
      if (window.paceOptions) {
        window.paceOptions.className = `pace-theme-${themeName}`;
      }
      // Restart Pace to apply new theme
      window.Pace.restart();
    }
  };

  document.head.appendChild(link);
};

// Function to update page title
const updatePageTitle = siteTitle => {
  if (siteTitle) {
    document.title = siteTitle;
  }
};

// Function to update favicon
const updateFavicon = bandLogoUrl => {
  if (bandLogoUrl) {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll(
      'link[rel*="icon"], link[rel="apple-touch-icon"]'
    );
    existingFavicons.forEach(link => link.remove());

    // Add new favicon links with proper type detection and cache busting
    const cacheBuster = '?v=' + Date.now();

    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';

    // Detect image type from URL or default to png
    const imageType = bandLogoUrl.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i);
    faviconLink.type = imageType ? `image/${imageType[1]}` : 'image/png';
    faviconLink.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(faviconLink);

    // Add apple touch icon with cache busting
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(appleTouchIcon);

    // Add shortcut icon for older browsers
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(shortcutIcon);

    // Add additional mobile-specific favicon links
    const appleTouchIconPrecomposed = document.createElement('link');
    appleTouchIconPrecomposed.rel = 'apple-touch-icon-precomposed';
    appleTouchIconPrecomposed.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(appleTouchIconPrecomposed);

    // Add 32x32 favicon specifically for mobile
    const favicon32 = document.createElement('link');
    favicon32.rel = 'icon';
    favicon32.type = 'image/png';
    favicon32.sizes = '32x32';
    favicon32.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(favicon32);

    // Add 16x16 favicon specifically for mobile
    const favicon16 = document.createElement('link');
    favicon16.rel = 'icon';
    favicon16.type = 'image/png';
    favicon16.sizes = '16x16';
    favicon16.href = bandLogoUrl + cacheBuster;
    document.head.appendChild(favicon16);
  }
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const themeState = useSelector(state => state.theme);
  const theme = themeState?.data;
  const isLoading = themeState?.loading || false;
  const error = themeState?.error;

  useEffect(() => {
    let isMounted = true;
    const loadTheme = async () => {
      try {
        await dispatch(fetchTheme());
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        if (isMounted) {
          // Loading state is now handled by Redux
        }
      }
    };
    loadTheme();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Update theme elements when theme changes
  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      updateCSSVariables(theme);
      // Update page title if it changed
      if (theme.siteTitle) {
        updatePageTitle(theme.siteTitle);
      }
      // Update favicon if it changed
      if (theme.bandLogoUrl) {
        updateFavicon(theme.bandLogoUrl);
      }
      // Update pace theme if it changed
      if (theme.paceTheme) {
        updatePaceTheme(theme.paceTheme);
      }
    }
  }, [theme]);

  const updateThemeData = async newTheme => {
    try {
      await dispatch(updateTheme(newTheme));
    } catch (error) {
      console.error('Failed to update theme:', error);
      throw error;
    }
  };

  const value = {
    theme,
    isLoading,
    error,
    updateTheme: updateThemeData,
    secondaryFont: theme?.secondaryFont,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
