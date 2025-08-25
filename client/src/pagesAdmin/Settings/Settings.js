import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Palette,
  EnvelopeFill,
  ShieldLock,
  Person,
  CreditCard,
  Gear,
} from '../../components/icons';
import './Settings.css';
import SidebarNav from './SidebarNav';
import ThemeSettings from './ThemeSettings';
import NewsletterSettings from './NewsletterSettings';
import SecuritySettings from './SecuritySettings';
import AccountSettings from './AccountSettings';
import BillingSettings from './BillingSettings';
import GeneralSettings from './GeneralSettings';

const Settings = ({ user, theme }) => {
  const [currentTab, setCurrentTab] = useState('theme');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check screen size and auto-collapse sidebar on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 700) {
        setSidebarOpen(false); // Auto-collapse on mobile
      } else {
        setSidebarOpen(true); // Auto-expand on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define all available tabs
  const tabs = [
    {
      id: 'theme',
      label: 'Theme & Design',
      icon: <Palette />,
      component: ThemeSettings,
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: <EnvelopeFill />,
      component: NewsletterSettings,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldLock />,
      component: SecuritySettings,
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Person />,
      component: AccountSettings,
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard />,
      component: BillingSettings,
    },
    {
      id: 'general',
      label: 'General',
      icon: <Gear />,
      component: GeneralSettings,
    },
  ];

  const currentTabData = tabs.find(tab => tab.id === currentTab);
  const CurrentComponent = currentTabData?.component;

  // Handle tab changes
  const handleTabChange = tabId => {
    setCurrentTab(tabId);
  };

  return (
    <div
      className='d-flex'
      style={{ minHeight: '100vh' }}
    >
      {/* Sidebar */}
      <SidebarNav
        user={user}
        tabs={tabs}
        currentTab={currentTabData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onTabChange={handleTabChange}
      />

      {/* Main Content */}
      <div
        className='main-content flex-grow-1 p-4'
        style={{
          marginLeft: sidebarOpen ? '0' : '0',
        }}
      >
        <div className='container-fluid'>
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth?.user || null,
  theme: state.theme?.data || null,
});

export default connect(mapStateToProps)(Settings);
