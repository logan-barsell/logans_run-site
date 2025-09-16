'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Custom hook for instant navigation in public pages
 * Provides React Router-like instant navigation while maintaining Next.js benefits
 */
export const usePublicNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Extract current page from pathname
  useEffect(() => {
    const pathParts = pathname.split('/').filter(Boolean);

    // For public routes, determine page based on first path segment
    if (pathParts.length === 0) {
      setCurrentPage('home'); // Root path
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
        setCurrentPage(null); // Don't use instant navigation for auth routes
      } else {
        setCurrentPage(mainPage);
      }
    }
  }, [pathname]);

  /**
   * Navigate to a page with instant UI update
   * @param {string} path - The path to navigate to (e.g., '/music')
   * @param {object} options - Navigation options
   */
  const navigate = useCallback(
    (path, options = {}) => {
      const { replace = false, scroll = true } = options;

      try {
        setIsNavigating(true);

        // Extract page name from path for instant UI update
        const pathParts = path.split('/').filter(Boolean);

        let pageName = 'home';
        if (pathParts.length > 0) {
          pageName = pathParts[0];
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
          new CustomEvent('publicNavigation', {
            detail: { path, pageName, replace },
          })
        );
      } catch (error) {
        console.error('Navigation error:', error);
        // Revert UI state on error
        setCurrentPage(pathname.split('/').pop() || 'home');
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
    console.log(`Preloading public ${pageName}...`);
  }, []);

  /**
   * Preload all public components for instant navigation
   */
  const preloadAllComponents = useCallback(async () => {
    // For now, we'll skip preloading Next.js page components
    // Next.js will handle prefetching automatically
    console.log('Preloading public components...');
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

export default usePublicNavigation;
