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

  // Update CSS variables when theme changes
  useEffect(() => {
    if (theme && Object.keys(theme).length > 0) {
      updateCSSVariables(theme);
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
