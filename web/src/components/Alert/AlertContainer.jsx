'use client';
import React from 'react';
import { useAlert } from '../../contexts/AlertContext';
import AlertItem from './AlertItem';
import './AlertContainer.css';

const AlertContainer = () => {
  const { alerts, position } = useAlert();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={`alert-container alert-container--${position}`}>
      {alerts.map(alert => (
        <AlertItem
          key={alert.id}
          alert={alert}
        />
      ))}
    </div>
  );
};

export default AlertContainer;
