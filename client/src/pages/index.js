import '../App.css';
// import '../plugins/loading-bar.css';
import '@stripe/stripe-js';

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopNav from '../components/Navbar/TopNav';
import BottomNav from '../components/Navbar/BottomNav';
import HomePage from './Home/Home';
import MusicPage from './Music/Music';
import MerchPage from './Merch/Merch';
import MediaPage from './Media/Media';
import BioPage from './Bio/Bio';
import ContactPage from './Contact/Contact';
import Signin from './Auth/Signin';
import NotFound from './NotFound';
import history from '../history';
import { ActiveContext } from '../contexts/ActiveContext';

const UserPages = () => {
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

  return (
    <>
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
          <Route
            path='/signin'
            exact
            element={<Signin />}
          />
          <Route
            path='*'
            element={<NotFound />}
          />
        </Routes>
        <BottomNav routes={routes} />
      </ActiveContext.Provider>
    </>
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
