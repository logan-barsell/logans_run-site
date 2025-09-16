'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Custom hook for instant navigation in admin pages
 * Provides React Router-like instant navigation while maintaining Next.js benefits
 */
export const useInstantNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Extract current page from pathname
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const adminIndex = pathParts.indexOf('admin');

    if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
      const mainPage = pathParts[adminIndex + 1];

      // Check if we're in a settings sub-route
      if (mainPage === 'settings' && pathParts[adminIndex + 2]) {
        const subPage = pathParts[adminIndex + 2];
        setCurrentPage(`settings-${subPage}`);
      } else {
        setCurrentPage(mainPage);
      }
    }
  }, [pathname]);

  /**
   * Navigate to a page with instant UI update
   * @param {string} path - The path to navigate to (e.g., '/admin/home')
   * @param {object} options - Navigation options
   */
  const navigate = useCallback(
    (path, options = {}) => {
      const { replace = false, scroll = true } = options;

      try {
        setIsNavigating(true);

        // Extract page name from path for instant UI update
        const pathParts = path.split('/').filter(Boolean);
        const adminIndex = pathParts.indexOf('admin');

        let pageName = 'home';
        if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
          const mainPage = pathParts[adminIndex + 1];

          // Check if we're in a settings sub-route
          if (mainPage === 'settings' && pathParts[adminIndex + 2]) {
            const subPage = pathParts[adminIndex + 2];
            pageName = `settings-${subPage}`;
          } else {
            pageName = mainPage;
          }
        }

        // Update UI instantly - this is the key change!
        setCurrentPage(pageName);

        // Update URL using window.history (no server round-trip)
        if (replace) {
          window.history.replaceState(null, '', path);
        } else {
          window.history.pushState(null, '', path);
        }

        // Scroll to top if requested
        if (scroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Trigger custom event for any components that need to know about navigation
        window.dispatchEvent(
          new CustomEvent('adminNavigation', {
            detail: { path, pageName, replace },
          })
        );
      } catch (error) {
        console.error('Navigation error:', error);
        // Revert UI state on error
        setCurrentPage(pathname.split('/').pop());
      } finally {
        setIsNavigating(false);
      }
    },
    [pathname]
  );

  /**
   * Preload a component for instant switching
   * @param {string} pageName - The page name to preload
   */
  const preloadComponent = useCallback(async pageName => {
    // For now, we'll skip preloading Next.js page components
    // as they may not be directly importable
    // This will be handled by Next.js's built-in prefetching
    console.log(`Preloading ${pageName}...`);
  }, []);

  /**
   * Preload all admin components for instant navigation
   */
  const preloadAllComponents = useCallback(async () => {
    // For now, we'll skip preloading Next.js page components
    // Next.js will handle prefetching automatically
    console.log('Preloading admin components...');
  }, []);

  /**
   * Handle browser back/forward navigation
   */
  const handlePopState = useCallback(() => {
    // Force re-render when user navigates with browser buttons
    window.location.reload();
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  return {
    currentPage,
    navigate,
    isNavigating,
    isPending,
    preloadComponent,
    preloadAllComponents,
  };
};

export default useInstantNavigation;
