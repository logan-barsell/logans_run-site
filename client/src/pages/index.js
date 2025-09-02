import '../App.css';
import '@stripe/stripe-js';

import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import TopNav from '../components/Navbar/TopNav';
import BottomNav from '../components/Navbar/BottomNav';
import HomePage from './Home/Home';
import MusicPage from './Music/Music';
import StorePage from './Store/Store';
import MediaPage from './Media/Media';
import BioPage from './Bio/Bio';
import ContactPage from './Contact/Contact';
import Signin from './Auth/Signin';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import TwoFactorVerification from './Auth/TwoFactorVerification';
import Unsubscribe from './Unsubscribe';
import NotFound from './NotFound';
import history from '../history';
import { ActiveContext } from '../contexts/ActiveContext';
import { AlertContainer } from '../components/Alert';

const UserPages = () => {
  const routes = [
    { name: 'Home', value: '/' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/store' },
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

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <ActiveContext.Provider
        value={{ activeIndex, setActiveIndex, toggle, setToggle }}
      >
        <TopNav routes={routes} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path='/'
              exact
              element={<HomePage />}
            />
            <Route
              path='/home'
              exact
              element={
                <Navigate
                  to='/'
                  replace
                />
              }
            />
            <Route
              path='/settings'
              exact
              element={
                <Navigate
                  to='/'
                  replace
                />
              }
            />
            <Route
              path='/music'
              exact
              element={<MusicPage />}
            />
            <Route
              path='/store'
              exact
              element={<StorePage />}
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
            <Route
              path='/signin'
              exact
              element={<Signin />}
            />
            <Route
              path='/forgot-password'
              exact
              element={<ForgotPassword />}
            />
            <Route
              path='/reset-password'
              exact
              element={<ResetPassword />}
            />
            <Route
              path='/2fa-verification'
              exact
              element={<TwoFactorVerification />}
            />
            <Route
              path='/unsubscribe'
              exact
              element={<Unsubscribe />}
            />
            <Route
              path='*'
              element={<NotFound />}
            />
          </Routes>
        </div>
        <BottomNav routes={routes} />
        <AlertContainer />
      </ActiveContext.Provider>
    </div>
  );
};

const User = () => {
  return (
    <Router history={history}>
      <UserPages />
    </Router>
  );
};

export default User;
