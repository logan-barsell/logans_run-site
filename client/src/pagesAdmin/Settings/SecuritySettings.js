import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';
import { changePassword } from '../../services/userService';
import {
  getSessions,
  endSession,
  endAllOtherSessions,
} from '../../services/sessionsService';
import * as SecurityPreferencesService from '../../services/securityPreferencesService';
import PasswordField from '../../components/Forms/FieldTypes/PasswordField';
import { RadioField } from '../../components/Forms/FieldTypes';
import Button from '../../components/Button/Button';
import TabNavigation from '../../components/Tabs/TabNavigation';
import EditableForm from '../../components/Forms/EditableForm';
import { DataTable } from '../../components/DataTable';
import { ShieldLock, People, Gear } from '../../components/icons';
import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
  validatePasswordStrength,
  getPasswordStrengthLabel,
} from '../../utils/validation';

const SecuritySettings = ({ currentSubTab }) => {
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();
  const location = useLocation();

  // Use currentSubTab from props, fallback to 'preferences' if not provided
  const activeTab = currentSubTab || 'preferences';
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [securityPreferences, setSecurityPreferences] = useState({
    loginAlerts: false, // Default to false - login alerts can be annoying
    sessionTimeout: 7, // days
    twoFactorEnabled: false,
  });

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSessions();
      setSessions(response.sessions || response.data?.sessions || []);
      setCurrentSessionId(response.data?.currentSessionId || null);
    } catch (error) {
      console.error('Error loading sessions:', error);
      showError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load security preferences
  const loadSecurityPreferences = useCallback(async () => {
    try {
      const response =
        await SecurityPreferencesService.getSecurityPreferences();
      if (response.success) {
        setSecurityPreferences(prev => ({
          ...prev,
          loginAlerts: response.data.loginAlerts,
          twoFactorEnabled: response.data.twoFactorEnabled,
        }));
      }
    } catch (error) {
      console.error('Error loading security preferences:', error);
    }
  }, []);

  // Load sessions and security preferences on component mount
  useEffect(() => {
    loadSessions();
    loadSecurityPreferences();
  }, [loadSessions, loadSecurityPreferences]);

  const handlePasswordChange = async formData => {
    if (formData.newPassword !== formData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    const passwordValidation = calculatePasswordStrength(formData.newPassword);
    if (passwordValidation === 'very-weak' || passwordValidation === 'weak') {
      showError('Password is too weak. Please use a stronger password.');
      return;
    }

    try {
      setLoading(true);
      await changePassword(formData.currentPassword, formData.newPassword);
      showSuccess('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      showError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async sessionId => {
    try {
      await endSession(sessionId);
      showSuccess('Session ended successfully');
      loadSessions(); // Reload sessions
    } catch (error) {
      console.error('Error ending session:', error);
      showError('Failed to end session');
    }
  };

  const handleEndAllOtherSessions = async () => {
    try {
      const response = await endAllOtherSessions();
      showSuccess(`Ended ${response.data.endedCount} other sessions`);
      loadSessions(); // Reload sessions
    } catch (error) {
      console.error('Error ending other sessions:', error);
      showError('Failed to end other sessions');
    }
  };

  const handleSavePreferences = async formData => {
    try {
      setLoading(true);

      // Update security preferences via API
      const result = await SecurityPreferencesService.updateSecurityPreferences(
        {
          loginAlerts: formData.loginAlerts,
          twoFactorEnabled: formData.twoFactorEnabled,
        }
      );

      if (!result.success) {
        showError(result.message || 'Failed to update security preferences');
        return;
      }

      // Update local state
      setSecurityPreferences(formData);
      showSuccess('Security preferences updated successfully');
    } catch (error) {
      console.error('Error saving security preferences:', error);
      showError('Failed to save security preferences');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
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
            {session.sessionId === currentSessionId && (
              <div className='mb-1'>
                <span
                  className='badge bg-primary'
                  style={{ fontSize: '0.7rem' }}
                >
                  Current Session
                </span>
              </div>
            )}
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

    const isCurrentSession = session.sessionId === currentSessionId;

    return (
      <Button
        variant='outline-danger'
        size='sm'
        onClick={() => handleEndSession(session.sessionId)}
        disabled={isCurrentSession}
        title={
          isCurrentSession
            ? 'Use logout to end your current session'
            : 'End this session'
        }
      >
        {isCurrentSession ? 'Current Session' : 'End Session'}
      </Button>
    );
  };

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
      {activeTab === 'preferences' && (
        <EditableForm
          initialData={securityPreferences}
          onSave={handleSavePreferences}
          title=''
          description='Configure your security notification and session preferences.'
          showTitle={false}
        >
          {({ formData, handleInputChange }) => (
            <>
              <div className='mb-4'>
                <RadioField
                  label='Login Alerts'
                  name='loginAlerts'
                  value={formData.loginAlerts}
                  onChange={handleInputChange}
                  toggle={true}
                  enabledText='Get notified when someone logs into your account'
                  disabledText='No login alerts'
                />
              </div>

              <div className='mb-4'>
                <RadioField
                  label='Two-Factor Authentication'
                  name='twoFactorEnabled'
                  value={formData.twoFactorEnabled}
                  onChange={handleInputChange}
                  toggle={true}
                  enabledText='Email verification code required to login'
                  disabledText='Email verification code not required for login'
                />
              </div>
            </>
          )}
        </EditableForm>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <EditableForm
          initialData={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
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
                  value={formData.currentPassword || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your current password'
                />
              </div>

              <div className='mb-sm-3 mb-2'>
                <div className='d-flex justify-content-between align-items-center mb-1'>
                  <label
                    htmlFor='newPassword'
                    className='form-label mb-0'
                  >
                    New Password
                  </label>
                  {formData.newPassword && (
                    <small
                      className={`text-${getPasswordStrengthColor(
                        calculatePasswordStrength(formData.newPassword)
                      )} d-none d-sm-inline`}
                      style={{
                        fontFamily: 'var(--secondary-font)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {getPasswordStrengthText(
                        calculatePasswordStrength(formData.newPassword)
                      )}
                    </small>
                  )}
                </div>
                <input
                  type='password'
                  className='form-control'
                  id='newPassword'
                  name='newPassword'
                  value={formData.newPassword || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Enter your new password'
                  autoComplete='new-password'
                />
                {formData.newPassword && (
                  <small
                    className={`text-${getPasswordStrengthColor(
                      calculatePasswordStrength(formData.newPassword)
                    )} d-sm-none mt-1`}
                    style={{
                      fontFamily: 'var(--secondary-font)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {getPasswordStrengthText(
                      calculatePasswordStrength(formData.newPassword)
                    )}
                  </small>
                )}
              </div>

              <div className='mb-sm-3 mb-2'>
                <PasswordField
                  label='Confirm New Password'
                  name='confirmPassword'
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  required
                  placeholder='Confirm your new password'
                  helperText={
                    formData.confirmPassword &&
                    formData.newPassword !== formData.confirmPassword
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
                className='mt-1 session-active-text'
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
    </div>
  );
};

export default SecuritySettings;
