'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminNavigation } from '../../contexts/AdminNavigationProvider';

// Import all admin page components
import HomeEdit from '../../app/(admin)/admin/home/page';
import MusicEdit from '../../app/(admin)/admin/music/page';
import StoreEdit from '../../app/(admin)/admin/store/page';
import MediaEdit from '../../app/(admin)/admin/media/page';
import BioEdit from '../../app/(admin)/admin/bio/page';
import ContactEdit from '../../app/(admin)/admin/contact/page';
import SettingsEdit from '../../app/(admin)/admin/settings/page';

// Import settings layout (which includes sidebar navigation)
import SettingsLayout from '../../app/(admin)/admin/settings/layout';

/**
 * Component that conditionally renders admin pages based on navigation state
 * This provides instant navigation by avoiding Next.js router delays
 */
const AdminContentRenderer = ({ children }) => {
  const pathname = usePathname();
  const { currentPage } = useAdminNavigation();
  const [activePage, setActivePage] = useState(null);

  // Extract current page from pathname or navigation state
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const adminIndex = pathParts.indexOf('admin');

    if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
      const mainPage = pathParts[adminIndex + 1];

      // Check if we're in a settings sub-route
      if (mainPage === 'settings' && pathParts[adminIndex + 2]) {
        const subPage = pathParts[adminIndex + 2];
        setActivePage(`settings-${subPage}`);
      } else {
        setActivePage(mainPage);
      }
    } else {
      setActivePage('home'); // Default to home
    }
  }, [pathname, currentPage]);

  // Listen for navigation events
  useEffect(() => {
    const handleNavigation = event => {
      const { pageName } = event.detail;
      setActivePage(pageName);
    };

    window.addEventListener('adminNavigation', handleNavigation);
    return () =>
      window.removeEventListener('adminNavigation', handleNavigation);
  }, []);

  // Render the appropriate component based on active page
  const renderContent = () => {
    // Check if we're in any settings route
    if (activePage === 'settings' || activePage?.startsWith('settings-')) {
      return <SettingsLayout>{children}</SettingsLayout>;
    }

    switch (activePage) {
      case 'home':
        return <HomeEdit />;
      case 'music':
        return <MusicEdit />;
      case 'store':
        return <StoreEdit />;
      case 'media':
        return <MediaEdit />;
      case 'bio':
        return <BioEdit />;
      case 'contact':
        return <ContactEdit />;
      default:
        return children; // Let unknown routes fall through to catch-all
    }
  };

  // If we're in client-side navigation mode, render our components
  // Otherwise, fall back to Next.js children (for initial load)
  if (activePage && typeof window !== 'undefined') {
    return renderContent();
  }

  // Fallback to Next.js children for SSR/initial load
  return children;
};

export default AdminContentRenderer;
