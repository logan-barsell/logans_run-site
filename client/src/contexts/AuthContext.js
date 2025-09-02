import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthentication,
  logout as logoutAction,
} from '../redux/actions/authActions';
import { refreshToken } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const {
    authenticated,
    loading: authLoading,
    user,
  } = useSelector(state => state.auth);

  const checkAuth = useCallback(async () => {
    return await dispatch(checkAuthentication());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  // Proactive token refresh every 50 minutes (before 1-hour expiry)
  useEffect(() => {
    if (authenticated) {
      const refreshInterval = setInterval(async () => {
        try {
          console.log('🔄 Auto-refreshing tokens...');
          await refreshToken();
        } catch (error) {
          console.error('❌ Auto token refresh failed:', error);
          // Don't logout here - let the interceptor handle it when API calls fail
        }
      }, 50 * 60 * 1000); // 50 minutes

      return () => {
        clearInterval(refreshInterval);
        console.log('🧹 Cleared auto-refresh interval');
      };
    }
  }, [authenticated]);

  const value = {
    authenticated,
    authLoading,
    user,
    checkAuthentication: checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
