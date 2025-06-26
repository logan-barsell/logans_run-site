import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
// for authentication
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from './contexts/ThemeContext';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <ThemeProvider>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
