import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsletterEdit from './NewsletterEdit';
import SubscribersList from './SubscribersList';
import TabNavigation from '../../components/Tabs/TabNavigation';
import { Gear, People } from '../../components/icons';

const NewsletterSettings = ({ currentSubTab }) => {
  const navigate = useNavigate();

  // Use currentSubTab from props, fallback to 'settings' if not provided
  const activeTab = currentSubTab || 'settings';

  const tabs = [
    { id: 'settings', label: 'Newsletter Settings', icon: <Gear /> },
    { id: 'subscribers', label: 'Subscribers', icon: <People /> },
  ];

  // Handle sub-tab changes
  const handleSubTabChange = subTabId => {
    navigate(`/settings/newsletter/${subTabId}`);
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
