import { generateMetadata } from '../../lib/metadata/generateMetadata';
import { TopNav } from '../../components/Navbar/TopNav/TopNav';
import BottomNav from '../../components/Navbar/BottomNav/BottomNav';
import ActiveContextProvider from '../../contexts/ActiveContextProvider';
import PublicNavigationProvider from '../../contexts/PublicNavigationProvider';
import PublicContentRenderer from '../../components/Navigation/PublicContentRenderer';

// Re-export generateMetadata from utils
export { generateMetadata };

export default function SiteLayout({ children }) {
  const routes = [
    { name: 'Home', value: '/' },
    { name: 'Music', value: '/music' },
    { name: 'Store', value: '/store' },
    { name: 'Media', value: '/media' },
    { name: 'Bio', value: '/bio' },
    { name: 'Contact', value: '/contact' },
  ];

  return (
    <ActiveContextProvider routes={routes}>
      <PublicNavigationProvider routes={routes}>
        <div className='d-flex flex-column min-vh-100'>
          <TopNav routes={routes} />
          <main className='flex-grow-1'>
            <PublicContentRenderer>{children}</PublicContentRenderer>
          </main>
          <BottomNav routes={routes} />
        </div>
      </PublicNavigationProvider>
    </ActiveContextProvider>
  );
}
