import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme, updateTheme } from '../redux/actions';
import { getColorPalette } from '../utils/colorPalettes';

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
    root.style.setProperty('--primary-font', theme.primaryFont);
  }
  if (theme.secondaryFont) {
    let fontStack = '';
    switch (theme.secondaryFont) {
      case 'Anton':
        fontStack = "'Anton', sans-serif";
        break;
      case 'ArchitectsDaughter':
        fontStack = "'Architects Daughter', cursive";
        break;
      case 'BebasNeue':
        fontStack = "'Bebas Neue', sans-serif";
        break;
      case 'ComicNeue':
        fontStack = "'Comic Neue', cursive";
        break;
      case 'Courier New':
        fontStack = "'Courier New', Courier, monospace";
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
      case 'Orbitron':
        fontStack = "'Orbitron', sans-serif";
        break;
      case 'Oswald':
        fontStack = "'Oswald', sans-serif";
        break;
      case 'Pacifico':
        fontStack = "'Pacifico', cursive";
        break;
      case 'Righteous':
        fontStack = "'Righteous', cursive";
        break;
      case 'RobotoCondensed':
        fontStack = "'Roboto Condensed', sans-serif";
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
        fontStack = "'Roboto Condensed', sans-serif";
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
  const themeName = paceTheme || 'center-atom';
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
