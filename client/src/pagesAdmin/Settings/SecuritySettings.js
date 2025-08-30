import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useAlert } from '../../contexts/AlertContext';
import securityService from '../../services/securityService';
import PasswordField from '../../components/Forms/FieldTypes/PasswordField';
import { RadioField } from '../../components/Forms/FieldTypes';
import Button from '../../components/Button/Button';
import TabNavigation from '../../components/Tabs/TabNavigation';
import EditableForm from '../../components/Forms/EditableForm';
import { DataTable } from '../../components/DataTable';
import { ShieldLock, People, Gear } from '../../components/icons';

const SecuritySettings = ({ user }) => {
  const { showSuccess, showError } = useAlert();
  const [activeTab, setActiveTab] = useState('password');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [securityPreferences, setSecurityPreferences] = useState({
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 7, // days
  });

  // Load sessions on component mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await securityService.getSessions();
      setSessions(response.sessions || response.data?.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      showError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (!passwordStrength?.isValid) {
      showError('Password does not meet strength requirements');
      return;
    }

    try {
      setLoading(true);
      await securityService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordStrength(null);
    } catch (error) {
      console.error('Error changing password:', error);
      showError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async sessionId => {
    try {
      await securityService.endSession(sessionId);
      showSuccess('Session ended successfully');
      loadSessions(); // Reload sessions
    } catch (error) {
      console.error('Error ending session:', error);
      showError('Failed to end session');
    }
  };

  const handleEndAllOtherSessions = async () => {
    if (
      !window.confirm(
        'Are you sure you want to end all other sessions? This will log you out of all other devices.'
      )
    ) {
      return;
    }

    try {
      const response = await securityService.endAllOtherSessions();
      showSuccess(`Ended ${response.data.endedCount} other sessions`);
      loadSessions(); // Reload sessions
    } catch (error) {
      console.error('Error ending other sessions:', error);
      showError('Failed to end other sessions');
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleString();
  };

  const getDeviceIcon = device => {
    if (device.includes('Mobile')) return '📱';
    if (device.includes('Tablet')) return '📱';
    if (device.includes('Mac')) return '💻';
    if (device.includes('Windows')) return '🖥️';
    if (device.includes('Linux')) return '🖥️';
    return '💻';
  };

  // Define columns for the sessions table
  const sessionColumns = [
    {
      key: 'device',
      header: 'Device',
      render: session => (
        <div className='d-flex align-items-center'>
          <div>
            <div style={{ fontWeight: 'bold', color: 'white' }}>
              {session.device} {getDeviceIcon(session.device)}
            </div>
            <small style={{ color: 'white' }}>{session.userAgent}</small>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: session => session.location,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: session => formatDate(session.loginTime),
    },
    {
      key: 'status',
      header: 'Status',
      render: session => (
        <span
          className={`badge ${
            session.isActive ? 'bg-success' : 'bg-secondary'
          }`}
        >
          {session.isActive ? 'Active' : 'Ended'}
        </span>
      ),
    },
  ];

  // Define row actions for the sessions table
  const sessionRowActions = session => {
    if (!session.isActive) return null;

    return (
      <Button
        variant='outline-danger'
        size='sm'
        onClick={() => handleEndSession(session.sessionId)}
      >
        End Session
      </Button>
    );
  };

  const tabs = [
    { id: 'password', label: 'Update Password', icon: <ShieldLock /> },
    { id: 'sessions', label: 'Active Sessions', icon: <People /> },
    { id: 'preferences', label: 'Security Preferences', icon: <Gear /> },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Password Tab */}
      {activeTab === 'password' && (
        <EditableForm
          initialData={passwordData}
          onSave={handlePasswordChange}
          title=''
          description='Update your password to keep your account secure. Use a strong password with at least 8 characters.'
          showTitle={false}
        >
          {({ formData, handleInputChange }) => (
            <>
              <div className='mb-sm-3 mb-2'>
                <PasswordField
                  label='Current Password'
                  name='currentPassword'
                  value={passwordData.currentPassword}
                  onChange={e =>
                    setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                  placeholder='Enter your current password'
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <PasswordField
                  label='New Password'
                  name='newPassword'
                  value={passwordData.newPassword}
                  onChange={e =>
                    setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  onStrengthChange={setPasswordStrength}
                  showStrengthIndicator={true}
                  required
                  placeholder='Enter your new password'
                />
              </div>

              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className='mt-2 mb-3'>
                  <div className='d-flex align-items-center mb-2'>
                    <span
                      className='me-2'
                      style={{ fontSize: '14px', color: 'white' }}
                    >
                      Strength:
                    </span>
                    <span
                      style={{
                        color: passwordStrength.isValid ? '#28a745' : '#dc3545',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      {passwordStrength.isValid
                        ? '✓ Strong'
                        : '⚠️ Needs improvement'}
                    </span>
                  </div>
                  {!passwordStrength.isValid &&
                    passwordStrength.feedback.length > 0 && (
                      <div
                        className='alert alert-warning py-2'
                        style={{ fontSize: '12px' }}
                      >
                        <strong>Requirements:</strong>
                        <ul className='mb-0 mt-1'>
                          {passwordStrength.feedback.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}

              <div className='mb-sm-3 mb-2'>
                <PasswordField
                  label='Confirm New Password'
                  name='confirmPassword'
                  value={passwordData.confirmPassword}
                  onChange={e =>
                    setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  placeholder='Confirm your new password'
                  helperText={
                    passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                />
              </div>
            </>
          )}
        </EditableForm>
      )}

      {/* Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className='custom-form-container'>
          <div className='text-center mb-4'>
            <p
              className='mb-3'
              style={{
                color: 'white',
                fontFamily: 'var(--secondary-font)',
              }}
            >
              Manage your active login sessions across different devices.
            </p>
            <div className='d-flex flex-column align-items-center'>
              <Button
                variant='outline-danger'
                onClick={handleEndAllOtherSessions}
                disabled={sessions.filter(s => s.isActive).length <= 1}
              >
                End All Sessions
              </Button>
              <small
                className='mt-1'
                style={{
                  color: 'white',
                  fontFamily: 'var(--secondary-font)',
                  fontSize: '0.75rem',
                }}
              >
                This will keep your current session active
              </small>
            </div>
          </div>

          <DataTable
            title={`Active Sessions (${sessions.length})`}
            data={sessions}
            columns={sessionColumns}
            loading={loading}
            emptyMessage='No active sessions found'
            emptyIcon='fas fa-laptop'
            rowActions={sessionRowActions}
            getRowKey={session => session.sessionId || session.id}
          />
        </div>
      )}

      {/* Security Preferences Tab */}
      {activeTab === 'preferences' && (
        <EditableForm
          initialData={securityPreferences}
          onSave={() => {}} // No save functionality for now
          title=''
          description='Configure your security notification and session preferences.'
          showTitle={false}
        >
          {({ formData, handleInputChange }) => (
            <>
              <div className='mb-4'>
                <RadioField
                  label='Email Notifications'
                  name='emailNotifications'
                  value={securityPreferences.emailNotifications}
                  onChange={e =>
                    setSecurityPreferences(prev => ({
                      ...prev,
                      emailNotifications: e.target.value === 'true',
                    }))
                  }
                  toggle={true}
                  enabledText='Receive email notifications for security events'
                  disabledText='No email notifications for security events'
                />
              </div>

              <div className='mb-4'>
                <RadioField
                  label='Login Alerts'
                  name='loginAlerts'
                  value={securityPreferences.loginAlerts}
                  onChange={e =>
                    setSecurityPreferences(prev => ({
                      ...prev,
                      loginAlerts: e.target.value === 'true',
                    }))
                  }
                  toggle={true}
                  enabledText='Get notified when someone logs into your account'
                  disabledText='No login alerts'
                />
              </div>

              <div className='alert alert-info'>
                <strong>Coming Soon:</strong> Additional security features
                including:
                <ul className='mb-0 mt-2'>
                  <li>Two-factor authentication (2FA)</li>
                  <li>Security audit log</li>
                  <li>Advanced session management</li>
                  <li>IP whitelisting</li>
                </ul>
              </div>
            </>
          )}
        </EditableForm>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth?.user || null,
});

export default connect(mapStateToProps)(SecuritySettings);
