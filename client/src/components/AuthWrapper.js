import React, { useState, useEffect } from 'react';
import { checkAuth } from '../services/authService';

const AuthWrapper = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await checkAuth();
        // Check if the response indicates successful authentication
        setAuthenticated(data.success && data.data && data.data.user);
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthenticated(false);
        // Don't show alert for auth check failures as they're expected for non-authenticated users
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading state while checking authentication
  if (authLoading) {
    return null; // Let Pace handle the loading UI
  }

  return children({ authenticated, setAuthenticated });
};

export default AuthWrapper;
