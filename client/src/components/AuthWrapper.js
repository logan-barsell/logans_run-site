import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthWrapper = ({ children }) => {
  const { authenticated, authLoading, checkAuthentication } = useAuth();
  const [hasChecked, setHasChecked] = React.useState(false);

  useEffect(() => {
    // Only check authentication once
    if (!hasChecked) {
      setHasChecked(true);
      checkAuthentication();
    }
  }, []); // Empty dependency array - only run once

  // Show loading state while checking authentication
  if (authLoading) {
    return null; // Let Pace handle the loading UI
  }

  return children({ authenticated, checkAuthentication, authLoading });
};

export default AuthWrapper;
