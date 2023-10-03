import './App.css';
import './plugins/loading-bar.css';
import '@stripe/stripe-js';

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
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Admin from './pagesAdmin';


export const ActiveContext = createContext();

function App() {


  const routes = [
    { name: 'Home', value: '/' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/merch' },
    { name: 'Media', value: '/media' },
    { name: 'About Us', value: '/aboutus' },
    { name: 'Contact', value: '/contact' }
  ];

  const currentUrl = window.location.pathname;

  let initialState;
  for (let i = 0; i < routes.length - 1; i++) {
    if (routes[i].value === currentUrl) {
      initialState = i;
    };
  };

  const [activeIndex, setActiveIndex] = useState(initialState);
  const [toggle, setToggle] = useState(false);


  return (
    <>
      <UnauthenticatedTemplate>
        <Router history={history}>
          <ActiveContext.Provider value={{ activeIndex, setActiveIndex, toggle, setToggle }}>
            <TopNav routes={routes} />
            <Routes>
              <Route path="/" exact element={<HomePage />} />
              <Route path="/music" exact element={<MusicPage />} />
              <Route path="/merch" exact element={<MerchPage />} />
              <Route path="/media" exact element={<MediaPage />} />
              <Route path="/aboutus" exact element={<BioPage />} />
              <Route path="/contact" exact element={<ContactPage />} />
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