'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTheme } from '../redux/actions';
import { generateStyleObject } from '../lib/theme/generateStyleObject';
import { defaultTheme } from '../lib/theme/defaultTheme';

const ThemeContext = createContext({ theme: null });

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ theme: serverTheme, children }) => {
  const dispatch = useDispatch();
  const reduxTheme = useSelector(state => state.theme?.data || {});
  const [clientTheme, setClientTheme] = useState(serverTheme || defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Update client theme when Redux theme changes
  useEffect(() => {
    if (reduxTheme && Object.keys(reduxTheme).length > 0) {
      setClientTheme(reduxTheme);
    }
  }, [reduxTheme]);

  // Function to update theme immediately (for instant updates)
  const updateTheme = newThemeData => {
    const updatedTheme = { ...clientTheme, ...newThemeData };
    setClientTheme(updatedTheme);

    // Update CSS variables immediately for instant visual feedback
    const styleObject = generateStyleObject(updatedTheme);
    const root = document.documentElement;
    Object.entries(styleObject).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  // Use the most up-to-date theme (client theme if hydrated, server theme otherwise)
  const theme = isHydrated ? clientTheme : serverTheme || defaultTheme;

  const value = {
    theme,
    secondaryFont: theme?.secondaryFont,
    updateTheme, // Expose the update function
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
