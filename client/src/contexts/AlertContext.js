import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';

// Alert types
export const ALERT_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info',
};

// Alert positions
export const ALERT_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_CENTER: 'top-center',
  BOTTOM_CENTER: 'bottom-center',
};

// Initial state
const initialState = {
  alerts: [],
  position: ALERT_POSITIONS.BOTTOM_RIGHT,
  maxAlerts: 3,
};

// Action types
const ADD_ALERT = 'ADD_ALERT';
const REMOVE_ALERT = 'REMOVE_ALERT';
const CLEAR_ALERTS = 'CLEAR_ALERTS';
const SET_POSITION = 'SET_POSITION';

// Reducer
const alertReducer = (state, action) => {
  switch (action.type) {
    case ADD_ALERT:
      const newAlerts = [...state.alerts, action.payload];
      // Keep only the last maxAlerts
      if (newAlerts.length > state.maxAlerts) {
        return {
          ...state,
          alerts: newAlerts.slice(-state.maxAlerts),
        };
      }
      return {
        ...state,
        alerts: newAlerts,
      };

    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload),
      };

    case CLEAR_ALERTS:
      return {
        ...state,
        alerts: [],
      };

    case SET_POSITION:
      return {
        ...state,
        position: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AlertContext = createContext();

// Provider component
export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Add alert function
  const addAlert = useCallback(
    ({
      type = ALERT_TYPES.INFO,
      message,
      duration = 3000,
      position = state.position,
    }) => {
      const id = Date.now() + Math.random();
      const alert = {
        id,
        type,
        message,
        duration,
        timestamp: Date.now(),
      };

      dispatch({ type: ADD_ALERT, payload: alert });

      return id;
    },
    [state.position]
  );

  // Remove alert function
  const removeAlert = useCallback(id => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    dispatch({ type: CLEAR_ALERTS });
  }, []);

  // Set position
  const setPosition = useCallback(position => {
    dispatch({ type: SET_POSITION, payload: position });
  }, []);

  // Convenience methods
  const showError = useCallback(
    (message, duration = 5000) => {
      return addAlert({ type: ALERT_TYPES.ERROR, message, duration });
    },
    [addAlert]
  );

  const showSuccess = useCallback(
    (message, duration = 3000) => {
      return addAlert({ type: ALERT_TYPES.SUCCESS, message, duration });
    },
    [addAlert]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => {
      return addAlert({ type: ALERT_TYPES.WARNING, message, duration });
    },
    [addAlert]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => {
      return addAlert({ type: ALERT_TYPES.INFO, message, duration });
    },
    [addAlert]
  );

  const value = {
    alerts: state.alerts,
    position: state.position,
    maxAlerts: state.maxAlerts,
    addAlert,
    removeAlert,
    clearAlerts,
    setPosition,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

// Custom hook to use alert context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
