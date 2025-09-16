'use client';

import { usePathname } from 'next/navigation';
import BottomNavEdit from './BottomNavEdit';

const ConditionalBottomNav = () => {
  const pathname = usePathname();

  // Don't render BottomNavEdit on settings pages, just like the old client app
  // Old logic: {!location.pathname.startsWith('/settings') && <BottomNavEdit />}
  if (pathname.startsWith('/admin/settings')) {
    return null;
  }

  return <BottomNavEdit />;
};

export default ConditionalBottomNav;
