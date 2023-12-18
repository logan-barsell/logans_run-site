import '../App.css';
import '../plugins/loading-bar.css';

import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopNavEdit from '../components/Navbar/NavBarEdit';
// import BottomNav from '../Navbar/BottomNav';
import HomeEdit from './Home/HomeEdit';
import MusicEdit from './Music/MusicEdit';
import MerchEdit from './Merch/MerchEdit';
import MediaEdit from './Media/MediaEdit';
import BioEdit from './Bio/BioEdit';
import ContactEdit from './Contact/ContactEdit';
import history from '../history';



export const ActiveContext = createContext();

const EditPages = () => {

  const routes = [
    { name: 'Home', value: '/home' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/merch' },
    { name: 'Media', value: '/media' },
    { name: 'Bio', value: '/aboutus' },
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
      <Router history={history}>
        <ActiveContext.Provider value={{ activeIndex, setActiveIndex, toggle, setToggle }}>
          <TopNavEdit routes={routes} />
          <Routes>
            <Route path="/home" exact element={<HomeEdit />} />
            <Route path="/music" exact element={<MusicEdit />} />
            <Route path="/merch" exact element={<MerchEdit />} />
            <Route path="/media" exact element={<MediaEdit />} />
            <Route path="/aboutus" exact element={<BioEdit />} />
            <Route path="/contact" exact element={<ContactEdit />} />
          </Routes>
        </ActiveContext.Provider>
      </Router>
    </>
  );
}

export default EditPages;