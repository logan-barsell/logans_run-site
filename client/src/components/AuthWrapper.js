import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthWrapper = ({ children }) => {
  const { authenticated, authLoading, checkAuthentication } = useAuth();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Show loading state while checking authentication
  if (authLoading) {
    return null; // Let Pace handle the loading UI
  }

  return children({ authenticated, checkAuthentication });
};

export default AuthWrapper;
