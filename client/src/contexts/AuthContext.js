import React, { createContext, useContext, useState, useCallback } from 'react';
import { checkAuth } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const checkAuthentication = useCallback(async () => {
    try {
      const data = await checkAuth();
      const isAuthenticated = data.success && data.data && data.data.user;
      setAuthenticated(isAuthenticated);
      return isAuthenticated;
    } catch (err) {
      console.error('Auth check failed:', err);
      setAuthenticated(false);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setAuthLoading(false);
  }, []);

  const value = {
    authenticated,
    authLoading,
    checkAuthentication,
    logout,
    setAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
