'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useInstantNavigation } from '../hooks/useInstantNavigation';

const AdminNavigationContext = createContext();

/**
 * Provider component that manages instant navigation for admin pages
 * Preloads components and provides navigation context to child components
 */
export const AdminNavigationProvider = ({ children, routes }) => {
  const { preloadAllComponents, navigate, currentPage } =
    useInstantNavigation();

  // Preload all admin components on mount for instant navigation
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
    <AdminNavigationContext.Provider value={contextValue}>
      {children}
    </AdminNavigationContext.Provider>
  );
};

/**
 * Hook to use admin navigation context
 */
export const useAdminNavigation = () => {
  const context = useContext(AdminNavigationContext);
  if (!context) {
    throw new Error(
      'useAdminNavigation must be used within AdminNavigationProvider'
    );
  }
  return context;
};

export default AdminNavigationProvider;
