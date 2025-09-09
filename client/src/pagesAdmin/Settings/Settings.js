import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Palette,
  EnvelopeFill,
  ShieldLock,
  Person,
  CreditCard,
} from '../../components/icons';
import './Settings.css';
import SidebarNav from '../../components/Navbar/SideBarNav/SidebarNav';
import ThemeEdit from './Theme/ThemeEdit';
import NewsletterSettings from './Newsletter/NewsletterSettings';
import SecuritySettings from './Security/SecuritySettings';
import AccountSettings from './Account/AccountSettings';
import BillingSettings from './Billing/BillingSettings';

const Settings = ({ theme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Extract current tab and sub-tab from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentTab = pathParts[1] || 'theme'; // /settings/theme -> theme
  const currentSubTab = pathParts[2] || null; // /settings/security/password -> password

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

  // Define all available tabs
  const tabs = [
    {
      id: 'theme',
      label: 'Theme & Design',
      icon: <Palette />,
      component: ThemeEdit,
      path: '/settings/theme',
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: <EnvelopeFill />,
      component: NewsletterSettings,
      path: '/settings/newsletter',
      defaultSubTab: 'settings',
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldLock />,
      component: SecuritySettings,
      path: '/settings/security',
      defaultSubTab: 'preferences',
    },
    {
      id: 'account',
      label: 'Account',
      icon: <Person />,
      component: AccountSettings,
      path: '/settings/account',
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard />,
      component: BillingSettings,
      path: '/settings/billing',
    },
  ];

  const currentTabData = tabs.find(tab => tab.id === currentTab);
  const CurrentComponent = currentTabData?.component;

  // Handle tab changes
  const handleTabChange = tabId => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      if (tab.defaultSubTab) {
        // Navigate to default sub-tab for tabs that have sub-tabs
        navigate(`${tab.path}/${tab.defaultSubTab}`);
      } else {
        // Navigate to main tab for tabs without sub-tabs
        navigate(tab.path);
      }
    }
  };

  return (
    <div
      className='d-flex'
      style={{ minHeight: '100vh' }}
    >
      {/* Sidebar */}
      <SidebarNav
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
        {CurrentComponent && <CurrentComponent currentSubTab={currentSubTab} />}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  theme: state.theme?.data || null,
});

export default connect(mapStateToProps)(Settings);
