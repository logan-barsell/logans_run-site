'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePublicNavigation } from '../hooks/usePublicNavigation';

const PublicNavigationContext = createContext();

/**
 * Provider component that manages instant navigation for public pages
 * Preloads components and provides navigation context to child components
 */
export const PublicNavigationProvider = ({ children, routes }) => {
  const { preloadAllComponents, navigate, currentPage } = usePublicNavigation();

  // Preload all public components on mount for instant navigation
  useEffect(() => {
    preloadAllComponents();
  }, [preloadAllComponents]);

  // Provide navigation context to child components
  const contextValue = {
    routes,
    navigate,
    currentPage,
    preloadAllComponents,
  };

  return (
    <PublicNavigationContext.Provider value={contextValue}>
      {children}
    </PublicNavigationContext.Provider>
  );
};

/**
 * Hook to use public navigation context
 */
export const usePublicNavigationContext = () => {
  const context = useContext(PublicNavigationContext);
  if (!context) {
    throw new Error(
      'usePublicNavigationContext must be used within PublicNavigationProvider'
    );
  }
  return context;
};

export default PublicNavigationProvider;
