'use client';

import React, { useContext, useCallback } from 'react';
import { useInstantNavigation } from '../../hooks/useInstantNavigation';
import { ActiveContext } from '../../contexts/ActiveContext';

/**
 * Instant navigation link component that provides React Router-like instant navigation
 * while maintaining Next.js benefits for SEO and server-side features
 */
const InstantNavLink = ({
  routes,
  menuToggle,
  className = '',
  children,
  ...props
}) => {
  const { setActiveIndex, activeIndex, toggle } = useContext(ActiveContext);
  const { navigate, isNavigating } = useInstantNavigation();

  const onNavClick = useCallback(
    (route, index) => {
      // Update active state instantly
      setActiveIndex(index);

      // Close mobile menu if open
      if (toggle === true) {
        menuToggle();
      }

      // Navigate instantly (synchronous now)
      navigate(route.value, { scroll: true });

      // Scroll to top
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [setActiveIndex, toggle, menuToggle, navigate]
  );

  const renderedNavItems = routes.map((route, index) => {
    const active = index === activeIndex ? 'active' : '';
    const hvrSink = menuToggle && !toggle ? 'hvr-sink' : '';
    const loading = isNavigating ? 'loading' : '';

    return (
      <a
        key={index}
        className={`nav-item nav-link ${hvrSink} ${active} ${loading} ${className}`}
        onClick={() => onNavClick(route, index)}
        disabled={isNavigating}
        {...props}
      >
        {route.name}
        {isNavigating && <span className='ms-2'>⟳</span>}
      </a>
    );
  });

  return renderedNavItems;
};

export default InstantNavLink;
