'use client';
import React, { useState, useEffect } from 'react';
import { useAlert } from '../../contexts/AlertContext';
import './AlertItem.css';

const AlertItem = ({ alert }) => {
  const { removeAlert } = useAlert();
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Handle auto-dismiss with fade-out
  useEffect(() => {
    if (alert.duration > 0) {
      const timer = setTimeout(() => {
        handleFadeOut();
      }, alert.duration);

      return () => clearTimeout(timer);
    }
  }, [alert.duration, alert.id]);

  const handleFadeOut = () => {
    setIsFading(true);
    // Wait for fade-out animation to complete, then remove
    setTimeout(() => {
      removeAlert(alert.id);
    }, 200);
  };

  const handleDismiss = () => {
    handleFadeOut();
  };

  const getAlertClass = () => {
    const baseClass = 'alert-item';
    const typeClass = `alert-item--${alert.type}`;
    const visibilityClass = isVisible ? 'alert-item--visible' : '';
    const fadeClass = isFading ? 'alert-item--fading' : '';

    return `${baseClass} ${typeClass} ${visibilityClass} ${fadeClass}`;
  };

  const getBootstrapClass = () => {
    switch (alert.type) {
      case 'error':
        return 'alert-danger';
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-info';
    }
  };

  return (
    <div className={getAlertClass()}>
      <div
        className={`alert ${getBootstrapClass()} alert-dismissible fade show`}
        role='alert'
      >
        <div className='alert-message'>{alert.message}</div>
        <button
          type='button'
          className='btn-close'
          onClick={handleDismiss}
          aria-label='Close'
        />
      </div>
    </div>
  );
};

export default AlertItem;
