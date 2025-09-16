'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSecurityPreferences } from '../../../../../redux/actions';
import TabNavigation from '../../../../../components/Tabs/TabNavigation';
import { ShieldLock, People, Gear } from '../../../../../components/icons';
import SecurityPreferences from './SecurityPreferences';
import UpdatePassword from './UpdatePassword';
import ActiveSessions from './ActiveSessions';

const SecuritySettings = ({ currentSubTab }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(currentSubTab || 'preferences');

  // Load security preferences on component mount
  useEffect(() => {
    dispatch(fetchSecurityPreferences());
  }, [dispatch]);

  // Listen for custom events from layout
  useEffect(() => {
    const handleSettingsTabChange = event => {
      const { tabId, subTabId } = event.detail;
      if (tabId === 'security') {
        if (subTabId) {
          setActiveTab(subTabId);
        } else {
          // When switching to security tab, set default sub-tab
          setActiveTab('preferences');
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
    { id: 'preferences', label: 'Security Preferences', icon: <Gear /> },
    { id: 'password', label: 'Update Password', icon: <ShieldLock /> },
    { id: 'sessions', label: 'Active Sessions', icon: <People /> },
  ];

  // Handle sub-tab changes - use window.history.pushState (no component unmounting)
  const handleSubTabChange = subTabId => {
    const newPath = `/admin/settings/security/${subTabId}`;

    // Update URL without unmounting component
    window.history.pushState(null, '', newPath);

    // Update local state
    setActiveTab(subTabId);

    // Trigger custom event for layout to listen to
    window.dispatchEvent(
      new CustomEvent('settingsTabChange', {
        detail: { tabId: 'security', subTabId },
      })
    );
  };

  return (
    <div>
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleSubTabChange}
      />

      {/* Security Preferences Tab */}
      {activeTab === 'preferences' && <SecurityPreferences />}

      {/* Password Tab */}
      {activeTab === 'password' && <UpdatePassword />}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && <ActiveSessions />}
    </div>
  );
};

export default SecuritySettings;
