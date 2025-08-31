import { Helmet } from 'react-helmet';
import { useTheme } from './contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { NavHeightProvider } from './contexts/NavHeightContext';
import { AlertProvider } from './contexts/AlertContext';
import { AuthProvider } from './contexts/AuthContext';
import { init as initMonitoring } from './services/monitoringService';

import React, { createContext } from 'react';
import Admin from './pagesAdmin';
import User from './pages';
import AuthWrapper from './components/AuthWrapper';

export const ActiveContext = createContext();

function App() {
  const { theme } = useTheme();
  const bioState = useSelector(state => state.currentBio);
  const currentBio = bioState?.data;
  const bioText =
    Array.isArray(currentBio) && currentBio[0]?.text ? currentBio[0].text : '';

  const defaultDescription = 'Welcome to the official site!';
  const metaDescription = bioText || defaultDescription;
  const bandName = theme?.siteTitle || 'Bandsyte';
  const bandLogo = theme?.bandLogoUrl;

  React.useEffect(() => {
    // Initialize monitoring
    initMonitoring();
  }, []);

  React.useEffect(() => {
    if (theme && theme.bandLogoUrl) {
      // Remove all existing favicons
      const links = document.querySelectorAll("link[rel~='icon']");
      links.forEach(link => link.parentNode.removeChild(link));
      // Add new favicon with cache-busting
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = theme.bandLogoUrl + '?v=' + new Date().getTime();
      document.head.appendChild(newLink);
    }
  }, [theme]);

  return (
    <AuthProvider>
      <AlertProvider>
        <NavHeightProvider>
          <>
            <Helmet>
              <title>{bandName}</title>
              <meta
                name='description'
                content={metaDescription}
              />
              {/* Open Graph tags */}
              <meta
                property='og:title'
                content={bandName}
              />
              <meta
                property='og:description'
                content={metaDescription}
              />
              <meta
                property='og:image'
                content={bandLogo}
              />
              {/* Twitter card tags */}
              <meta
                name='twitter:title'
                content={bandName}
              />
              <meta
                name='twitter:description'
                content={metaDescription}
              />
              <meta
                name='twitter:image'
                content={bandLogo}
              />
            </Helmet>
            <AuthWrapper>
              {({ authenticated }) => (authenticated ? <Admin /> : <User />)}
            </AuthWrapper>
          </>
        </NavHeightProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
