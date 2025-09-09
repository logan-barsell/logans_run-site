import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSecurityPreferences } from '../../../redux/actions';
import TabNavigation from '../../../components/Tabs/TabNavigation';
import { ShieldLock, People, Gear } from '../../../components/icons';
import SecurityPreferences from './SecurityPreferences';
import UpdatePassword from './UpdatePassword';
import ActiveSessions from './ActiveSessions';

const SecuritySettings = ({ currentSubTab, fetchSecurityPreferences }) => {
  const navigate = useNavigate();

  // Use currentSubTab from props, fallback to 'preferences' if not provided
  const activeTab = currentSubTab || 'preferences';

  // Load security preferences on component mount
  useEffect(() => {
    fetchSecurityPreferences();
  }, [fetchSecurityPreferences]);

  const tabs = [
    { id: 'preferences', label: 'Security Preferences', icon: <Gear /> },
    { id: 'password', label: 'Update Password', icon: <ShieldLock /> },
    { id: 'sessions', label: 'Active Sessions', icon: <People /> },
  ];

  // Handle sub-tab changes
  const handleSubTabChange = subTabId => {
    navigate(`/settings/security/${subTabId}`);
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

function mapStateToProps({ securityPreferences }) {
  return {
    // This component doesn't need the full state, just ensures preferences are loaded
    securityPreferences: securityPreferences || {
      data: null,
      loading: false,
      error: null,
    },
  };
}

export default connect(mapStateToProps, {
  fetchSecurityPreferences,
})(SecuritySettings);
