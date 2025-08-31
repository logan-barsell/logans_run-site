import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuthentication,
  logout as logoutAction,
} from '../redux/actions/authActions';

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

  const value = {
    authenticated,
    authLoading,
    user,
    checkAuthentication: checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
