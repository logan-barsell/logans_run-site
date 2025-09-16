'use client';

import './Media.css';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Pictures from './Pictures';
import Videos from './Videos';
import SecondaryNav from '../../../components/Navbar/SecondaryNav/SecondaryNav';

export default function MediaPage() {
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState('pictures');
  const navOptions = ['Pictures', 'Videos'];

  // Initialize current tab from URL or default to pictures
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['pictures', 'videos'].includes(tabFromUrl)) {
      setCurrentTab(tabFromUrl);
    } else {
      // Set default tab in URL if none exists
      const url = new URL(window.location);
      url.searchParams.set('tab', 'pictures');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

  // Listen for navigation events to update tab
  useEffect(() => {
    const handleNavigation = event => {
      const { path } = event.detail;
      const url = new URL(path, window.location.origin);
      const tab = url.searchParams.get('tab');
      if (tab && ['pictures', 'videos'].includes(tab)) {
        setCurrentTab(tab);
      }
    };

    window.addEventListener('publicNavigation', handleNavigation);
    return () =>
      window.removeEventListener('publicNavigation', handleNavigation);
  }, []);

  const onNavClick = (option, event) => {
    event.preventDefault();
    const tabValue = option.toLowerCase();
    setCurrentTab(tabValue);

    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('tab', tabValue);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0 });
  };

  return (
    <div
      id='blog'
      className='fadeIn'
    >
      <SecondaryNav
        options={navOptions}
        currentTab={currentTab}
        onTabClick={onNavClick}
        showTabs={true}
      />
      <div className='container'>
        {currentTab === 'pictures' && <Pictures />}
        {currentTab === 'videos' && <Videos />}
      </div>
    </div>
  );
}
