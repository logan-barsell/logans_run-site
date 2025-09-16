'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ActiveContext } from '../contexts/ActiveContext';

export default function ActiveContextProvider({ routes, children }) {
  const pathname = usePathname();
  const currentUrl = pathname;

  // Calculate initial state based on current URL (matching CRA logic)
  let initialState = null;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].value === currentUrl) {
      initialState = i;
      break;
    }
  }

  // For admin routes, if we're on a settings page, ensure no nav item is highlighted
  if (currentUrl.startsWith('/settings')) {
    initialState = null;
  }

  const [activeIndex, setActiveIndex] = useState(initialState);
  const [toggle, setToggle] = useState(false);

  // Update activeIndex when URL changes (matching CRA logic)
  useEffect(() => {
    let newActiveIndex = null;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].value === currentUrl) {
        newActiveIndex = i;
        break;
      }
    }

    // If we're on a settings page, ensure no nav item is highlighted
    if (currentUrl.startsWith('/settings')) {
      newActiveIndex = null;
    }

    setActiveIndex(newActiveIndex);
  }, [currentUrl, routes]);

  const activeValue = useMemo(
    () => ({ activeIndex, setActiveIndex, toggle, setToggle }),
    [activeIndex, toggle]
  );

  return (
    <ActiveContext.Provider value={activeValue}>
      {children}
    </ActiveContext.Provider>
  );
}
