import React, { useState } from 'react';
import NewsletterEdit from './NewsletterEdit';
import SubscribersList from './SubscribersList';
import TabNavigation from '../../components/Tabs/TabNavigation';
import { Gear, People } from '../../components/icons';

const NewsletterSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'Newsletter Settings', icon: <Gear /> },
    { id: 'subscribers', label: 'Subscribers', icon: <People /> },
  ];

  return (
    <div>
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'settings' && <NewsletterEdit />}
      {activeTab === 'subscribers' && <SubscribersList />}
    </div>
  );
};

export default NewsletterSettings;
