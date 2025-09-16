'use client';

import './mediaEdit.css';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PicturesEdit from './PicturesEdit/PicturesEdit';
import VideosEdit from './VideosEdit/Videos';
import SecondaryNav from '../../../../components/Navbar/SecondaryNav/SecondaryNav';

export default function MediaEditPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const navOptions = ['Pictures', 'Videos'];

  useEffect(() => {
    if (!currentTab) {
      // Use Next.js router to update URL without page reload
      const url = new URL(window.location);
      url.searchParams.set('tab', 'pictures');
      window.history.replaceState({}, '', url);
    }
  }, [currentTab]);

  const onNavClick = (option, event) => {
    event.preventDefault();
    const url = new URL(window.location);
    url.searchParams.set('tab', option.toLowerCase());
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0 });
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
}
