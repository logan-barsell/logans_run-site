import { Helmet } from 'react-helmet';
import { useTheme } from './contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { NavHeightProvider } from './contexts/NavHeightContext';

import React, { createContext, useState, useEffect } from 'react';
import Admin from './pagesAdmin';
import User from './pages';

export const ActiveContext = createContext();

function App() {
  const { theme } = useTheme();
  const currentBio = useSelector(state => state.currentBio);
  const bioText =
    Array.isArray(currentBio) && currentBio[0]?.text ? currentBio[0].text : '';

  const defaultDescription = 'Welcome to the official site!';
  const metaDescription = bioText || defaultDescription;
  const bandName = theme.siteTitle || "Logan's Run";
  const bandLogo = theme.bandLogoUrl;

  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const data = await res.json();
        setAuthenticated(!!data.authenticated);
      } catch (err) {
        console.error('Auth check failed:', err);
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
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

  // Show loading state while checking authentication
  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
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
        {authenticated ? <Admin /> : <User />}
      </>
    </NavHeightProvider>
  );
}

export default App;
