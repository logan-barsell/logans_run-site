'use client';
import React from 'react';

const SideNavTab = ({ tab, isActive, onClick }) => {
  return (
    <button
      className={`nav-item nav-link ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        color: isActive ? 'var(--main)' : 'white',
        background: 'transparent',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        padding: '0.75rem 1rem',
        fontSize: '21px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
        {tab.icon}
      </span>
      {tab.label}
    </button>
  );
};

export default SideNavTab;
