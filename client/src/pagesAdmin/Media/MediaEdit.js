import './mediaEdit.css';

import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PicturesEdit from './PicturesEdit';
import VideosEdit from './videoEdit/VideosEdit';

function mapStateToProps({ media, videos }) {
  return {
    images: media?.data || [],
    videos: videos?.data || [],
  };
}

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

  const renderedNavItems = navOptions.map((option, index) => {
    const active = option.toLowerCase() === currentTab ? 'active' : '';
    return (
      <li
        key={index}
        className='nav-item col-auto'
      >
        <a
          href='#!'
          className={`nav-link ${active}`}
          onClick={event => onNavClick(option, event)}
        >
          {option}
        </a>
      </li>
    );
  });

  return (
    <div id='mediaEdit'>
      <ul className='nav main justify-content-center'>
        <div className='text-center row align-items-center'>
          {renderedNavItems}
        </div>
      </ul>
      <div className='container mb-5 pb-5'>
        {currentTab === 'pictures' && <PicturesEdit />}
        {currentTab === 'videos' && <VideosEdit />}
      </div>
    </div>
  );
};

export default MediaEdit;
