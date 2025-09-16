'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';
import { NavHeightProvider } from '@/contexts/NavHeightContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';
import { TenantProvider } from '@/contexts/TenantProvider';

export default function Providers({ children, theme, tenant }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <ThemeProvider theme={theme}>
          <TenantProvider tenant={tenant}>
            <AuthProvider>
              <AlertProvider>
                <NavHeightProvider>{children}</NavHeightProvider>
              </AlertProvider>
            </AuthProvider>
          </TenantProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
