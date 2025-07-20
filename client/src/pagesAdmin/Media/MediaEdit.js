import './mediaEdit.css';

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PicturesEdit from './PicturesEdit/PicturesEdit';
import VideosEdit from './VideosEdit/Videos';
import SecondaryNav from '../../components/Navbar/SecondaryNav';

const MediaEdit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');
  const navOptions = ['Pictures', 'Videos'];

  useEffect(() => {
    !currentTab && setSearchParams({ tab: 'pictures' });
  }, [currentTab, setSearchParams]);

  const onNavClick = (option, event) => {
    event.preventDefault();
    window.scrollTo({ top: 0 });
    setSearchParams({ tab: option.toLowerCase() });
  };

  return (
    <div id='mediaEdit'>
      <SecondaryNav
        options={navOptions}
        currentTab={currentTab}
        onTabClick={onNavClick}
        showTabs={true}
      />
      <div className='container mb-5 pb-5'>
        {currentTab === 'pictures' && <PicturesEdit />}
        {currentTab === 'videos' && <VideosEdit />}
      </div>
    </div>
  );
};

export default MediaEdit;
