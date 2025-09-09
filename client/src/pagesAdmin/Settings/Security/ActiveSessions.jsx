import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useAlert } from '../../../contexts/AlertContext';
import {
  fetchSessions,
  endSessionAction,
  endAllOtherSessionsAction,
} from '../../../redux/actions';
import Button from '../../../components/Button/Button';
import { DataTable } from '../../../components/DataTable';

const ActiveSessions = ({
  sessions,
  fetchSessions,
  endSessionAction,
  endAllOtherSessionsAction,
}) => {
  const { showSuccess, showError } = useAlert();

  // Load sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleEndSession = async sessionId => {
    const result = await endSessionAction(sessionId);
    if (result.success) {
      showSuccess('Session ended successfully');
      fetchSessions(); // Reload sessions
    } else {
      showError(result.error?.message || 'Failed to end session');
    }
  };

  const handleEndAllOtherSessions = async () => {
    const result = await endAllOtherSessionsAction();
    if (result.success) {
      showSuccess(`Ended ${result.data?.endedCount || 'all other'} sessions`);
      fetchSessions(); // Reload sessions
    } else {
      showError(result.error?.message || 'Failed to end other sessions');
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
            {session.isCurrent && (
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

    const isCurrentSession = session.isCurrent;

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

  return (
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
            disabled={
              !Array.isArray(sessions?.data) ||
              sessions.data.filter(s => s.isActive).length <= 1
            }
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
        title={`Active Sessions (${sessions?.data?.length || 0})`}
        data={sessions?.data || []}
        columns={sessionColumns}
        loading={sessions?.loading || false}
        emptyMessage='No active sessions found'
        emptyIcon='fas fa-laptop'
        rowActions={sessionRowActions}
        getRowKey={session => session.sessionId || session.id}
      />
    </div>
  );
};

function mapStateToProps({ sessions }) {
  return {
    sessions: sessions || { data: [], loading: false, error: null },
  };
}

export default connect(mapStateToProps, {
  fetchSessions,
  endSessionAction,
  endAllOtherSessionsAction,
})(ActiveSessions);
