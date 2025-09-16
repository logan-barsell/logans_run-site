'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Palette,
  EnvelopeFill,
  ShieldLock,
  Person,
  CreditCard,
} from '../../../../components/icons';
import './Settings.css';
import SidebarNav from '../../../../components/Navbar/SideBarNav/SidebarNav.jsx';

// Import the settings components
import ThemeEdit from './theme/ThemeEdit';
import NewsletterSettings from './newsletter/NewsletterSettings';
import SecuritySettings from './security/SecuritySettings';
import AccountSettings from './account/AccountSettings';
import BillingSettings from './billing/BillingSettings';
import NotFound from '../../../../components/NotFound/NotFound';

export default function SettingsLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState('theme');
  const [currentSubTab, setCurrentSubTab] = useState('');

  // Check screen size and auto-collapse sidebar on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 825) {
        setSidebarOpen(false); // Auto-collapse on mobile
      } else {
        setSidebarOpen(true); // Auto-expand on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract current tab and sub-tab from pathname
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const settingsIndex = pathParts.indexOf('settings');

    if (settingsIndex !== -1 && pathParts[settingsIndex + 1]) {
      const mainTab = pathParts[settingsIndex + 1];
      const subTab = pathParts[settingsIndex + 2] || '';

      setCurrentTab(mainTab);
      setCurrentSubTab(subTab);
    }
  }, [pathname]);

  // Define all available tabs (same as previous implementation)
  const tabs = [
    {
      id: 'theme',
      label: 'Theme & Design',
      icon: <Palette />,
      path: '/admin/settings/theme',
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: <EnvelopeFill />,
      path: '/admin/settings/newsletter',
      defaultSubTab: 'settings',
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldLock />,
      path: '/admin/settings/security',
      defaultSubTab: 'preferences',
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Person />,
      path: '/admin/settings/account',
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard />,
      path: '/admin/settings/billing',
    },
  ];

  // Handle tab changes with window.history.pushState (no component unmounting)
  const handleTabChange = tabId => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      // Update URL without unmounting component
      window.history.pushState(null, '', tab.path);

      // Update state
      setCurrentTab(tabId);
      setCurrentSubTab('');

      // Trigger custom event for components to listen to
      window.dispatchEvent(
        new CustomEvent('settingsTabChange', {
          detail: { tabId, subTabId: '' },
        })
      );
    }
  };

  // Handle sub-tab changes with window.history.pushState
  const handleSubTabChange = subTabId => {
    const newPath = `/admin/settings/${currentTab}/${subTabId}`;

    // Update URL without unmounting component
    window.history.pushState(null, '', newPath);

    // Update state
    setCurrentSubTab(subTabId);

    // Trigger custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent('settingsTabChange', {
        detail: { tabId: currentTab, subTabId },
      })
    );
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      // Force re-render when user navigates with browser back/forward
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentTabData = tabs.find(tab => tab.id === currentTab);

  // Define valid main tabs
  const validMainTabs = [
    'theme',
    'newsletter',
    'security',
    'account',
    'billing',
  ];

  // Define valid sub-tabs for each tab
  const validSubTabs = {
    newsletter: ['settings', 'subscribers'],
    security: ['password', 'preferences', 'sessions'],
  };

  // Check if current tab is valid
  const isInvalidMainTab = !validMainTabs.includes(currentTab);

  // Check if currentSubTab is valid for the current tab
  const isInvalidSubTab =
    currentSubTab &&
    validSubTabs[currentTab] &&
    !validSubTabs[currentTab].includes(currentSubTab);

  return (
    <div
      className='d-flex'
      style={{ minHeight: '100vh' }}
    >
      {/* Sidebar - same as previous implementation */}
      <SidebarNav
        tabs={tabs}
        currentTab={currentTabData}
        currentSubTab={currentSubTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onTabChange={handleTabChange}
        onSubTabChange={handleSubTabChange}
      />

      {/* Main Content - same styling as previous */}
      <div
        className='main-content flex-grow-1 p-4'
        style={{
          marginLeft: sidebarOpen ? '0' : '0',
        }}
      >
        {/* Conditionally render content based on current tab */}
        {isInvalidMainTab || isInvalidSubTab ? (
          <NotFound
            variant='admin'
            onNavigate={path => {
              window.history.pushState(null, '', path);
              window.location.reload();
            }}
          />
        ) : (
          <>
            {currentTab === 'theme' && <ThemeEdit />}
            {currentTab === 'newsletter' && (
              <NewsletterSettings currentSubTab={currentSubTab || 'settings'} />
            )}
            {currentTab === 'security' && (
              <SecuritySettings
                currentSubTab={currentSubTab || 'preferences'}
              />
            )}
            {currentTab === 'account' && <AccountSettings />}
            {currentTab === 'billing' && <BillingSettings />}
          </>
        )}
      </div>
    </div>
  );
}
