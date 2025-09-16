'use client';

import React, { useState, useEffect } from 'react';
import NewsletterEdit from './NewsletterEdit.js';
import SubscribersList from './SubscribersList';
import TabNavigation from '../../../../../components/Tabs/TabNavigation';
import { Gear, People } from '../../../../../components/icons';

const NewsletterSettings = ({ currentSubTab }) => {
  const [activeTab, setActiveTab] = useState(currentSubTab || 'settings');

  // Listen for custom events from layout
  useEffect(() => {
    const handleSettingsTabChange = event => {
      const { tabId, subTabId } = event.detail;
      if (tabId === 'newsletter') {
        if (subTabId) {
          setActiveTab(subTabId);
        } else {
          // When switching to newsletter tab, set default sub-tab
          setActiveTab('settings');
        }
      }
    };

    window.addEventListener('settingsTabChange', handleSettingsTabChange);
    return () =>
      window.removeEventListener('settingsTabChange', handleSettingsTabChange);
  }, []);

  // Update activeTab when currentSubTab prop changes
  useEffect(() => {
    if (currentSubTab) {
      setActiveTab(currentSubTab);
    }
  }, [currentSubTab]);

  const tabs = [
    { id: 'settings', label: 'Newsletter Settings', icon: <Gear /> },
    { id: 'subscribers', label: 'Subscribers', icon: <People /> },
  ];

  // Handle sub-tab changes - use window.history.pushState (no component unmounting)
  const handleSubTabChange = subTabId => {
    const newPath = `/admin/settings/newsletter/${subTabId}`;

    // Update URL without unmounting component
    window.history.pushState(null, '', newPath);

    // Update local state
    setActiveTab(subTabId);

    // Trigger custom event for layout to listen to
    window.dispatchEvent(
      new CustomEvent('settingsTabChange', {
        detail: { tabId: 'newsletter', subTabId },
      })
    );
  };

  return (
    <div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleSubTabChange}
      />

      {activeTab === 'settings' && <NewsletterEdit />}
      {activeTab === 'subscribers' && <SubscribersList />}
    </div>
  );
};

export default NewsletterSettings;
