import './App.css';
import './plugins/loading-bar.css';
import '@stripe/stripe-js';
import { Helmet } from 'react-helmet';
import { useTheme } from './contexts/ThemeContext';
import { useSelector } from 'react-redux';

import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopNav from './components/Navbar/TopNav';
import BottomNav from './components/Navbar/BottomNav';
import HomePage from './pages/Home/Home';
import MusicPage from './pages/Music/Music';
import MerchPage from './pages/Merch/Merch';
import MediaPage from './pages/Media/Media';
import BioPage from './pages/Bio/Bio';
import ContactPage from './pages/Contact/Contact';
import history from './history';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import Admin from './pagesAdmin';

export const ActiveContext = createContext();

function App() {
  const { theme } = useTheme();
  const currentBio = useSelector(state => state.currentBio);
  const bioText =
    Array.isArray(currentBio) && currentBio[0]?.text ? currentBio[0].text : '';

  const routes = [
    { name: 'Home', value: '/' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/merch' },
    { name: 'Media', value: '/media' },
    { name: 'Bio', value: '/bio' },
    { name: 'Contact', value: '/contact' },
  ];

  const currentUrl = window.location.pathname;

  let initialState;
  for (let i = 0; i < routes.length - 1; i++) {
    if (routes[i].value === currentUrl) {
      initialState = i;
    }
  }

  const [activeIndex, setActiveIndex] = useState(initialState);
  const [toggle, setToggle] = useState(false);

  const defaultDescription = 'Welcome to the official site!';
  const metaDescription = bioText || defaultDescription;
  const bandName = theme.siteTitle || "Logan's Run";
  const bandLogo = theme.bandLogoUrl;

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
      <UnauthenticatedTemplate>
        <Router history={history}>
          <ActiveContext.Provider
            value={{ activeIndex, setActiveIndex, toggle, setToggle }}
          >
            <TopNav routes={routes} />
            <Routes>
              <Route
                path='/'
                exact
                element={<HomePage />}
              />
              <Route
                path='/music'
                exact
                element={<MusicPage />}
              />
              <Route
                path='/merch'
                exact
                element={<MerchPage />}
              />
              <Route
                path='/media'
                exact
                element={<MediaPage />}
              />
              <Route
                path='/bio'
                exact
                element={<BioPage />}
              />
              <Route
                path='/contact'
                exact
                element={<ContactPage />}
              />
            </Routes>
            <BottomNav routes={routes} />
          </ActiveContext.Provider>
        </Router>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <Admin />
      </AuthenticatedTemplate>
    </>
  );
}

export default App;
