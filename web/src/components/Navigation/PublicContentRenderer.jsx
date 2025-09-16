'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePublicNavigationContext } from '../../contexts/PublicNavigationProvider';

// Import all public page components
import HomePage from '../../app/(public)/page';
import MusicPage from '../../app/(public)/music/page';
import BioPage from '../../app/(public)/bio/page';
import MediaPage from '../../app/(public)/media/page';
import StorePage from '../../app/(public)/store/page';
import ContactPage from '../../app/(public)/contact/page';

/**
 * Component that conditionally renders public pages based on navigation state
 * This provides instant navigation by avoiding Next.js router delays
 */
const PublicContentRenderer = ({ children }) => {
  const pathname = usePathname();
  const { currentPage } = usePublicNavigationContext();
  const [activePage, setActivePage] = useState(null);

  // Extract current page from pathname or navigation state
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);

    // For public routes, determine page based on first path segment
    if (pathParts.length === 0) {
      setActivePage('home'); // Root path
    } else {
      const mainPage = pathParts[0];

      // Handle special auth routes that shouldn't use instant navigation
      const authRoutes = [
        'signin',
        'forgot-password',
        'reset-password',
        '2fa-verification',
        'unsubscribe',
      ];
      if (authRoutes.includes(mainPage)) {
        setActivePage(null); // Don't use instant navigation for auth routes
      } else {
        setActivePage(mainPage);
      }
    }
  }, [pathname, currentPage]);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigation = event => {
      const { pageName } = event.detail;
      setActivePage(pageName);
    };

    window.addEventListener('publicNavigation', handleNavigation);
    return () =>
      window.removeEventListener('publicNavigation', handleNavigation);
  }, []);

  // Render the appropriate component based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'music':
        return <MusicPage />;
      case 'bio':
        return <BioPage />;
      case 'media':
        return <MediaPage />;
      case 'store':
        return <StorePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return children; // Let unknown routes fall through to catch-all
    }
  };

  // If we're in client-side navigation mode, render our components
  // Otherwise, fall back to Next.js children (for initial load and auth routes)
  if (activePage && typeof window !== 'undefined') {
    return renderContent();
  }

  return children;
};

export default PublicContentRenderer;
