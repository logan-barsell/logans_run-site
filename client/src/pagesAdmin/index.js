import '../App.css';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from 'react-router-dom';
import TopNavEdit from '../components/Navbar/NavBarEdit';
import HomeEdit from './Home/HomeEdit';
import MusicEdit from './Music/MusicEdit';
import MerchEdit from './Merch/MerchEdit';
import MediaEdit from './Media/MediaEdit';
import BioEdit from './Bio/BioEdit';
import ContactEdit from './Contact/ContactEdit';
import Settings from './Settings/Settings';
import history from '../history';
import BottomNavEdit from '../components/Navbar/BottomNavEdit';
import { ActiveContext } from '../contexts/ActiveContext';
import { AlertContainer } from '../components/Alert';

const AdminPages = () => {
  const location = useLocation();
  const routes = useMemo(
    () => [
      { name: 'Home', value: '/home' },
      { name: 'Music', value: '/music' },
      { name: 'Store', value: '/store' },
      { name: 'Media', value: '/media' },
      { name: 'Bio', value: '/bio' },
      { name: 'Contact', value: '/contact' },
    ],
    []
  );

  const currentUrl = location.pathname;

  let initialState = null; // Default to no active nav item
  for (let i = 0; i < routes.length; i++) {
    // Check all routes
    if (routes[i].value === currentUrl) {
      initialState = i;
      break; // Found the route, no need to continue
    }
  }

  // If we're on a settings page, ensure no nav item is highlighted
  if (currentUrl.startsWith('/settings')) {
    initialState = null;
  }

  const [activeIndex, setActiveIndex] = useState(initialState);
  const [toggle, setToggle] = useState(false);

  // Update activeIndex when URL changes
  useEffect(() => {
    let newActiveIndex = null; // Default to no active nav item
    for (let i = 0; i < routes.length; i++) {
      // Check all routes
      if (routes[i].value === currentUrl) {
        newActiveIndex = i;
        break; // Found the route, no need to continue
      }
    }

    // If we're on a settings page, ensure no nav item is highlighted
    if (currentUrl.startsWith('/settings')) {
      newActiveIndex = null;
    }

    setActiveIndex(newActiveIndex);
  }, [currentUrl, routes]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <ActiveContext.Provider
        value={{ activeIndex, setActiveIndex, toggle, setToggle }}
      >
        <TopNavEdit routes={routes} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path='/'
              exact
              element={
                <Navigate
                  to='/settings/theme'
                  replace
                />
              }
            />
            <Route
              path='/signin'
              exact
              element={
                <Navigate
                  to='/settings/theme'
                  replace
                />
              }
            />
            <Route
              path='/2fa-verification'
              exact
              element={
                <Navigate
                  to='/settings/theme'
                  replace
                />
              }
            />
            <Route
              path='/home'
              exact
              element={<HomeEdit />}
            />
            <Route
              path='/music'
              exact
              element={<MusicEdit />}
            />
            <Route
              path='/store'
              exact
              element={<MerchEdit />}
            />
            <Route
              path='/media'
              exact
              element={<MediaEdit />}
            />
            <Route
              path='/bio'
              exact
              element={<BioEdit />}
            />
            <Route
              path='/contact'
              exact
              element={<ContactEdit />}
            />
            {/* Settings Routes */}
            <Route
              path='/settings'
              exact
              element={
                <Navigate
                  to='/settings/theme'
                  replace
                />
              }
            />
            <Route
              path='/settings/theme'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/newsletter'
              exact
              element={
                <Navigate
                  to='/settings/newsletter/settings'
                  replace
                />
              }
            />
            <Route
              path='/settings/newsletter/settings'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/newsletter/subscribers'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/security'
              exact
              element={
                <Navigate
                  to='/settings/security/preferences'
                  replace
                />
              }
            />
            <Route
              path='/settings/security/preferences'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/security/password'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/security/sessions'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/account'
              exact
              element={<Settings />}
            />
            <Route
              path='/settings/billing'
              exact
              element={<Settings />}
            />
          </Routes>
        </div>
        {!location.pathname.startsWith('/settings') && <BottomNavEdit />}
        <AlertContainer />
      </ActiveContext.Provider>
    </div>
  );
};

const Admin = () => {
  return (
    <Router history={history}>
      <AdminPages />
    </Router>
  );
};

export default Admin;
