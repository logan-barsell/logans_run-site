import './Media.css';

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pictures from './Pictures';
import Videos from './Videos';
import SecondaryNav from '../../components/Navbar/SecondaryNav';

function mapStateToProps({ media, videos }) {
  return {
    images: media?.data || [],
    videos: videos?.data || [],
  };
}

const MediaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab');
  const navOptions = ['Pictures', 'Videos'];

  useEffect(() => {
    !currentTab && setSearchParams({ tab: 'pictures' });
  }, [currentTab, setSearchParams]);

  const onNavClick = (option, event) => {
    event.preventDefault();
    setSearchParams({ tab: option.toLowerCase() });
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
};

export default MediaPage;
