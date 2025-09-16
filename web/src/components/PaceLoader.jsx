'use client';
import { useEffect, useState } from 'react';

const PaceLoader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Ensure Pace starts when client-side hydration completes
    // This is a backup in case pace doesn't auto-start
    if (typeof window !== 'undefined' && window.Pace && !window.Pace.running) {
      // Small delay to ensure theme-loader.js has run
      setTimeout(() => {
        if (window.Pace && !window.Pace.running) {
          window.Pace.start();
        }
      }, 100);
    }
  }, []);

  // Don't render anything on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return null; // This component only handles backup initialization
};

export default PaceLoader;
