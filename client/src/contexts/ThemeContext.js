import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTheme, updateTheme } from '../redux/actions';

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
  if (theme.primaryFont) {
    root.style.setProperty('--primary-font', theme.primaryFont);
  }
  if (theme.secondaryFont) {
    let fontStack = '';
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
      case 'Courier New':
      default:
        fontStack = "'Courier New', Courier, monospace";
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

    // Add new favicon links with proper type detection
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';

    // Detect image type from URL or default to png
    const imageType = bandLogoUrl.match(/\.(jpg|jpeg|png|gif|svg|ico)$/i);
    faviconLink.type = imageType ? `image/${imageType[1]}` : 'image/png';
    faviconLink.href = bandLogoUrl;
    document.head.appendChild(faviconLink);

    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = bandLogoUrl;
    document.head.appendChild(appleTouchIcon);

    // Add shortcut icon for older browsers
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = bandLogoUrl;
    document.head.appendChild(shortcutIcon);
  }
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        await dispatch(fetchTheme());
      } catch (error) {
        console.error('Failed to load theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
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
    updateTheme: updateThemeData,
    secondaryFont: theme.secondaryFont,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
