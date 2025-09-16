import { generateMetadata } from '../../lib/metadata/generateMetadata';
import { getTenantFromRequest } from '../../lib/tenancy/getTenantFromRequest';
import { getServerTheme } from '../../lib/theme/getServerTheme';
import { TenantProvider } from '../../contexts/TenantProvider';
import { ThemeProvider } from '../../contexts/ThemeContext';
import ActiveContextProvider from '../../contexts/ActiveContextProvider';
import NavBarEdit from '../../components/Navbar/TopNav/NavBarEdit';
import ConditionalBottomNav from '../../components/Navbar/BottomNav/ConditionalBottomNav';
import AlertContainer from '../../components/Alert/AlertContainer';
import AdminNavigationProvider from '../../contexts/AdminNavigationProvider';
import AdminContentRenderer from '../../components/Navigation/AdminContentRenderer';

// Re-export generateMetadata from utils
export { generateMetadata };

export default async function AdminLayout({ children }) {
  const tenant = await getTenantFromRequest();
  const theme = await getServerTheme(tenant?.id);

  const routes = [
    { name: 'Home', value: '/admin/home' },
    { name: 'Music', value: '/admin/music' },
    { name: 'Store', value: '/admin/store' },
    { name: 'Media', value: '/admin/media' },
    { name: 'Bio', value: '/admin/bio' },
    { name: 'Contact', value: '/admin/contact' },
  ];

  return (
    <TenantProvider tenantId={tenant?.id}>
      <ThemeProvider theme={theme}>
        <ActiveContextProvider routes={routes}>
          <AdminNavigationProvider routes={routes}>
            <div className='d-flex flex-column min-vh-100'>
              <NavBarEdit routes={routes} />
              <main className='flex-grow-1'>
                <AdminContentRenderer>{children}</AdminContentRenderer>
              </main>
              <ConditionalBottomNav />
              <AlertContainer />
            </div>
          </AdminNavigationProvider>
        </ActiveContextProvider>
      </ThemeProvider>
    </TenantProvider>
  );
}
