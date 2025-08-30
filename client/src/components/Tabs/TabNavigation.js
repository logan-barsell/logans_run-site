import React, { useRef, useEffect, useState } from 'react';
import './TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const updateIndicator = () => {
      if (navRef.current) {
        const activeButton = navRef.current.querySelector('.nav-link.active');
        if (activeButton) {
          const navRect = navRef.current.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();

          setIndicatorStyle({
            left: buttonRect.left - navRect.left,
            width: buttonRect.width,
          });
        }
      }
    };

    // Update indicator position
    updateIndicator();

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  return (
    <div className={`tab-navigation ${className}`}>
      <nav>
        <div
          className='nav nav-tabs'
          ref={navRef}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.icon && <span className='tab-icon'>{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
          {/* Sliding indicator */}
          <div
            className='tab-indicator'
            style={indicatorStyle}
          />
        </div>
      </nav>
    </div>
  );
};

export default TabNavigation;
