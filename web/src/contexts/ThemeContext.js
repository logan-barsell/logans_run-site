'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { generateStyleObject } from '../lib/theme/generateStyleObject';
import { defaultTheme } from '../lib/theme/defaultTheme';
import {
  getCachedTheme,
  setCachedTheme,
  setCachedDefaultTheme,
} from '../lib/theme/themeCache';

const ThemeContext = createContext({ theme: null });

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ theme: serverTheme, tenant, children }) => {
  const reduxTheme = useSelector(state => state.theme?.data || {});
  const [clientTheme, setClientTheme] = useState(serverTheme || defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check for cached theme on hydration
  useEffect(() => {
    if (isHydrated && tenant?.id) {
      const cachedTheme = getCachedTheme(tenant.id);
      if (cachedTheme && !reduxTheme?.id) {
        // Use cached theme if no Redux theme is loaded yet
        setClientTheme(cachedTheme);
        console.log('🎨 Using cached theme for tenant:', tenant.id);
      }
    }
  }, [isHydrated, tenant?.id, reduxTheme?.id]);

  // Update client theme when Redux theme changes
  useEffect(() => {
    if (reduxTheme && Object.keys(reduxTheme).length > 0) {
      setClientTheme(reduxTheme);

      // Cache the theme for offline use
      if (tenant?.id) {
        setCachedTheme(tenant.id, reduxTheme);
      }

      // Also cache as default theme if it's marked as default
      if (reduxTheme.isDefault) {
        setCachedDefaultTheme(reduxTheme);
      }
    }
  }, [reduxTheme, tenant?.id]);

  // Cache server theme on initial load
  useEffect(() => {
    if (serverTheme && tenant?.id) {
      setCachedTheme(tenant.id, serverTheme);

      // Also cache as default theme if it's marked as default
      if (serverTheme.isDefault) {
        setCachedDefaultTheme(serverTheme);
      }
    }
  }, [serverTheme, tenant?.id]);

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
