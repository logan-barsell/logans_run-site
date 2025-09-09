import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '../../icons';
import SideNavTab from './SideNavTab';

const SidebarNav = ({
  tabs,
  currentTab,
  sidebarOpen,
  setSidebarOpen,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = tabId => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.defaultSubTab) {
        navigate(`${tab.path}/${tab.defaultSubTab}`);
      } else {
        navigate(tab.path);
      }
    }
  };

  return (
    <aside
      className={`sidebar-nav shadow-sm position-relative ${
        sidebarOpen ? 'w-25 p-4' : 'w-auto p-2'
      }`}
      style={{
        minWidth: sidebarOpen ? '300px' : '60px',
        maxWidth: sidebarOpen ? '300px' : '60px',
        width: sidebarOpen ? '300px' : '60px',
        backgroundColor: 'var(--navbar-bg)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        overflow: 'visible',
      }}
    >
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className='sidebar-toggle btn btn-sm btn-outline-light position-absolute'
        style={{
          right: '-12px',
          top: '24px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div
        style={{
          opacity: sidebarOpen ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          transitionDelay: sidebarOpen ? '0.1s' : '0s',
          overflow: 'hidden',
        }}
      >
        {sidebarOpen && (
          <>
            <nav
              className='d-flex flex-column gap-2'
              style={{ marginTop: '60px' }}
            >
              {tabs.map(tab => (
                <SideNavTab
                  key={tab.id}
                  tab={tab}
                  isActive={currentTab?.id === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                />
              ))}
            </nav>
          </>
        )}
      </div>

      <div
        style={{
          opacity: sidebarOpen ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
          transitionDelay: sidebarOpen ? '0s' : '0.1s',
          overflow: 'hidden',
        }}
      >
        {!sidebarOpen && (
          <div
            className='d-flex flex-column align-items-center gap-3'
            style={{ marginTop: '60px' }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`collapsed-icon nav-item nav-link ${
                  currentTab?.id === tab.id ? 'active' : ''
                }`}
                style={{
                  width: '40px',
                  height: '40px',
                  color: currentTab?.id === tab.id ? 'var(--main)' : 'white',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleTabClick(tab.id)}
                title={tab.label}
              >
                <span
                  style={{
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {tab.icon}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarNav;
