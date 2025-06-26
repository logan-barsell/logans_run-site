import '../App.css';
import '../plugins/loading-bar.css';

import React, { useState, createContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import TopNavEdit from '../components/Navbar/NavBarEdit';
import HomeEdit from './Home/HomeEdit';
import MusicEdit from './Music/MusicEdit';
import MerchEdit from './Merch/MerchEdit';
import MediaEdit from './Media/MediaEdit';
import BioEdit from './Bio/BioEdit';
import ContactEdit from './Contact/ContactEdit';
import ThemeEdit from './Theme/ThemeEdit';
import history from '../history';
import BottomNavEdit from '../components/Navbar/BottomNavEdit';

export const ActiveContext = createContext();

const EditPagesContent = () => {
  const location = useLocation();
  const routes = [
    { name: 'Home', value: '/home' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/merch' },
    { name: 'Media', value: '/media' },
    { name: 'Bio', value: '/aboutus' },
    { name: 'Contact', value: '/contact' },
  ];

  const currentUrl = location.pathname;

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
        <TopNavEdit routes={routes} />
        <Routes>
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
            path='/merch'
            exact
            element={<MerchEdit />}
          />
          <Route
            path='/media'
            exact
            element={<MediaEdit />}
          />
          <Route
            path='/aboutus'
            exact
            element={<BioEdit />}
          />
          <Route
            path='/contact'
            exact
            element={<ContactEdit />}
          />
          <Route
            path='/theme'
            exact
            element={<ThemeEdit />}
          />
        </Routes>
        {location.pathname !== '/theme' && <BottomNavEdit />}
      </ActiveContext.Provider>
    </>
  );
};

const EditPages = () => {
  return (
    <Router history={history}>
      <EditPagesContent />
    </Router>
  );
};

export default EditPages;
