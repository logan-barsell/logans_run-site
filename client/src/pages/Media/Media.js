import './Media.css';

import React, { useState, useEffect } from 'react';
import  { useSearchParams } from 'react-router-dom';
import Pictures from './Pictures';
import Videos from './Videos';


const MediaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');
  const navOptions = ['Pictures', 'Videos'];

  useEffect(() => {
    !currentTab && setSearchParams({'tab': 'pictures'});
  }, [currentTab, setSearchParams]);

  const onNavClick = (option, event) => {
    event.preventDefault();
    setSearchParams({'tab': option.toLowerCase()});
    window.scrollTo({ top: 0 });
  }

  const renderedNavItems = navOptions.map((option, index) => {
    const active = option.toLowerCase() === currentTab ? 'active' : '';
    return (
      <li key={index} className="nav-item col-auto">
        <a href="#!" className={`nav-link ${active}`} onClick={(event) => onNavClick(option, event)}>
          {option}
        </a>
      </li>
    )
  })



  return (
    <div id="blog" className="fadeIn">

      <ul className="nav main  justify-content-center">
        <div className="text-center row align-items-center">
          {renderedNavItems}
        </div>
      </ul>
      <div className="container">
        {currentTab === 'pictures' &&
          <Pictures />
        }
        {currentTab === 'videos' &&
          <Videos />
        }
      </div>


    </div>
  );
}

export default MediaPage;