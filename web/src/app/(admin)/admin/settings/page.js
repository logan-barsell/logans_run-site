'use client';

import { useEffect } from 'react';

export default function SettingsPage() {
  useEffect(() => {
    // Redirect to theme settings using window.history.pushState (no component unmounting)
    window.history.pushState(null, '', '/admin/settings/theme');

    // Trigger custom event for layout to listen to
    window.dispatchEvent(
      new CustomEvent('settingsTabChange', {
        detail: { tabId: 'theme', subTabId: '' },
      })
    );
  }, []);

  return null;
}
